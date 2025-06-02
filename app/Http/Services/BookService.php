<?php

namespace App\Http\Services;

use App\Models\Book;
use App\Models\Format;
use App\Models\User;
use Exception;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;
use Ren\Http\Services\Utils\AuthUtil;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class BookService
{
    private $authUtil;

    public function __construct(AuthUtil $authUtil)
    {
        $this->authUtil = $authUtil;
    }

    public function listUserBooks(User $user): AbstractPaginator
    {
        return $user->books()->paginate();
    }

    public function createBook(array $data, User $user): Book
    {
        $this->authUtil->checkUserAffiliation($user, "Try to add book for another user.");
        if ($this->isBookExist($data["title"], $user))
            throw new BadRequestHttpException("Book with title = \"" . $data["title"] . "\" already exist.");
        if (!$this->hasEnoughSpace($user, $data["files"]))
            throw new BadRequestHttpException("Not enough space for files.");

        $book = new Book;
        foreach ($data as $key => $value) {
            if (!Str::contains($key, ["genres", "files"])) {
                $book->$key = $value;
            }
        }

        $book->base_file_path = Uuid::uuid4();
        $user->books()->save($book);
        try {
            $this->setGenres($book, $data["genres"]);
            $this->setFiles($book, $user->user_path_name, $data["files"]);
        } catch (Exception $e) {
            $book->delete();
            throw $e;
        }
        $book->refresh();

        return $book;
    }

    protected function setGenres(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->genres()->attach($data);
        }
    }

    protected function setFormats(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->formats()->attach($data);
        }
    }

    protected function updateGenres(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->genres()->sync($data);
        }
    }

    protected function updateFormats(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->formats()->sync($data);
        }
    }

    protected function uploadFiles(array $files, string $discRelativeDir, string $baseFileName): array
    {
        $availableExt = Format::all();
        $fileExt = [];
        Storage::makeDirectory($discRelativeDir);
        foreach ($files as $key => $value) {
            if ($availableExt->contains("name", $value->extension())) {
                $fileExt[] = $availableExt->firstWhere("name", $value->extension())->id;
                Storage::putFileAs($discRelativeDir, $value, $baseFileName . "." . $value->extension());
            } else {
                throw new BadRequestHttpException("File extension " . $value->extension() . " does not support.");
            }
        }
        return $fileExt;
    }

    protected function setFiles(Book &$book, string $userPathName, array $data): void
    {
        $relDir = $userPathName . "/" . $book->base_file_path;

        $extId = $this->uploadFiles($data, $relDir, $book->base_file_path);
        $this->setFormats($book, $extId);
    }

    private function isBookExist(string $title, User $user): bool
    {
        return $user->books()->where("title", $title)->get()->isNotEmpty();
    }

    private function hasEnoughSpace(User $user, $files): bool
    {
        $inputSizeByte = 0;
        foreach ($files as $key => $value) {
            $inputSizeByte += $value->getSize();
        }

        $maxSpaceByte = 0;
        if ($user->plan === "limited") {
            $maxSpaceByte = 1073741824;
        } elseif ($user->plan === "pro") {
            $maxSpaceByte = 21474836480;
        }

        $totalSizeByte = $inputSizeByte + $user->files_size_byte;
        if (
            $user->files_size_byte > $maxSpaceByte
            || $user->files_size_byte > $totalSizeByte
        ) {
            return false;
        }
        return true;
    }
}
