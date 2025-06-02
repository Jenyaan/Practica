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
        $user->files_size_byte = $this->uploadFileSizeByte($data["files"]);
        $user->save();

        return $book;
    }

    public function updateBook(Book $book, array $data): Book
    {
        $user = $book->user;
        $this->authUtil->checkUserAffiliation($user, "Try to add book for another user.");
        if (array_key_exists("title", $data) && $this->isBookExist($data["title"], $user))
            throw new BadRequestHttpException("Book with title = \"" . $data["title"] . "\" already exist.");

        foreach ($data as $key => $value) {
            if (!Str::contains($key, ["genres", "files", "formats"])) {
                $book->$key = $value;
            }
        }
        if (array_key_exists("genres", $data)) {
            $this->updateGenres($book, $data["genres"]);
        }
        if (array_key_exists("formats", $data)) {
            $this->syncFiles($book, $user, $data["formats"], array_key_exists("files", $data) ? $data["files"] : []);
        }

        return $book;
    }

    private function setGenres(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->genres()->attach($data);
        }
    }

    private function setFormats(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->formats()->attach($data);
        }
    }

    private function updateGenres(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->genres()->sync($data);
        }
    }

    private function updateFormats(Book &$book, array $data)
    {
        if (!empty($data)) {
            $book->formats()->sync($data);
        }
    }

    private function uploadFiles(array $files, string $discRelativeDir, string $baseFileName): array
    {
        $availableExt = Format::all();
        $fileExt = [];
        $failed = [];
        foreach ($files as $key => $value) {
            if (!$availableExt->contains("name", $value->extension())) {
                $failed[] = $value->extension();
            }
        }
        if (!empty($failed)) {
            throw new BadRequestHttpException("File extension [" . implode(", ", $failed) . "] does not support.");
        }

        Storage::makeDirectory($discRelativeDir);
        foreach ($files as $key => $value) {
            $fileExt[] = $availableExt->firstWhere("name", $value->extension())->id;
            Storage::putFileAs($discRelativeDir, $value, $baseFileName . "." . $value->extension());
        }
        return $fileExt;
    }

    private function syncFiles(Book $book, User $user, array $formats, array $files): void
    {
        $relDir = $user->user_path_name . "/" . $book->base_file_path;
        $formatCollection = collect($formats);
        $avaliableFormats = Format::all();
        $extId = [];

        $discFiles = collect(Storage::files($relDir));
        $removeFiles = $discFiles->reject(function ($file) use ($formatCollection, $avaliableFormats, $extId) {
            $fileExt = str($file)->explode(".")->last();
            $contains = $formatCollection->contains($fileExt);
            if ($contains) {
                $extId[] = $avaliableFormats->firstWhere("name", $fileExt);
            }
            return $contains;
        });
        Storage::delete($removeFiles->toArray());

        if (!$this->hasEnoughSpace($user, $files))
            throw new BadRequestHttpException("Not enough space for files.");

        if (!empty($files)) {
            $extId[] = $this->uploadFiles($files, $relDir, $book->base_file_path);
        }
        $this->updateFormats($book, $extId);
    }

    private function setFiles(Book &$book, string $userPathName, array $data): void
    {
        $relDir = $userPathName . "/" . $book->base_file_path;

        $extId = $this->uploadFiles($data, $relDir, $book->base_file_path);
        $this->setFormats($book, $extId);
    }

    private function isBookExist(string $title, User $user): bool
    {
        return $user->books()->where("title", $title)->get()->isNotEmpty();
    }

    private function hasEnoughSpace(User $user, array $files): bool
    {
        $inputSizeByte = $this->uploadFileSizeByte($files);

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

    private function uploadFileSizeByte(array $files): int
    {
        return collect($files)->map(fn($file) => $file->getSize())->sum();
    }
}
