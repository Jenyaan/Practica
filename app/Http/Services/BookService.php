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

    public function listUserBooks(User $user, array $query): AbstractPaginator
    {
        $this->authUtil->checkUserAffiliation($user, "Try to list book for another user.");
        $books = $user->books();
        $this->filterBooks($books, $query);

        $perPage = array_key_exists("per_page", $query) ? $query["per_page"] : 15;
        return $books->paginate($perPage);
    }

    public function listPublicBooks(array $query): AbstractPaginator
    {
        $books = Book::where("public", true);
        $this->filterBooks($books, $query);

        $perPage = array_key_exists("per_page", $query) ? $query["per_page"] : 15;
        return $books->paginate($perPage);
    }

    public function createBook(array $data, User $user): Book
    {
        $this->authUtil->checkUserAffiliation($user, "Try to add book for another user.");
        if ($this->isBookExist($data["title"], $user)) {
            throw new BadRequestHttpException("Book with title = \"" . $data["title"] . "\" already exist.");
        }
        if (!$this->hasEnoughSpaceToUpload($user->plan, $user->files_size_byte, $data["files"])) {
            throw new BadRequestHttpException("Not enough space for files.");
        }

        $book = new Book;
        foreach ($data as $key => $value) {
            if (!Str::contains($key, ["genres", "files", "image"])) {
                $book->$key = $value;
            }
        }

        $book->base_file_path = Uuid::uuid4();
        $book->image_url = $data["image"]->storePublicly("covers/" . $book->base_file_path, "public");
        $user->books()->save($book);
        try {
            $this->setGenres($book, $data["genres"]);
            $this->setFiles($book, $user->user_path_name, $data["files"]);
        } catch (Exception $e) {
            $book->delete();
            throw $e;
        }
        $book->refresh();
        $user->files_size_byte += $this->uploadFilesSizeByte($data["files"]);
        $user->save();

        return $book;
    }

    public function showBook(Book $book): Book
    {
        if (!$book->public) {
            $this->authUtil->checkUserAffiliation($book->user, "Try to get not public book");
        }

        return $book;
    }

    public function updateBook(Book $book, array $data): Book
    {
        $user = $book->user;
        $this->authUtil->checkUserAffiliation($user, "Try to update book for another user.");
        if (array_key_exists("title", $data) && $this->isBookExist($data["title"], $user)) {
            throw new BadRequestHttpException("Book with title = \"" . $data["title"] . "\" already exist.");
        }

        foreach ($data as $key => $value) {
            if (!Str::contains($key, ["genres", "files", "formats", "image"])) {
                $book->$key = $value;
            }
        }
        if (array_key_exists("genres", $data)) {
            $this->updateGenres($book, $data["genres"]);
        }
        if (array_key_exists("formats", $data)) {
            $this->syncFiles($book, $user, $data["formats"], array_key_exists("files", $data) ? $data["files"] : []);
        } elseif (array_key_exists("files", $data)) {
            $this->syncFiles($book, $user, $book->formats->toArray(), $data["files"]);
        }
        if (array_key_exists("image", $data)) {
            Storage::disk("public")->delete($book->image_url);
            $book->image_url = $data["image"]->storePublicly("covers/" . $user->user_path_name, "public");
        }
        $book->save();

        return $book;
    }

    public function deleteBook(Book $book): Book
    {
        $user = $book->user;
        $this->authUtil->checkUserAffiliation($user, "Try to delete book for another user.");
        $user->files_size_byte -= $this->deleteFiles($user->user_path_name, $book->base_file_path);
        Storage::disk("public")->deleteDirectory("covers/" . $book->base_file_path);
        $user->save();
        $book->load(["genres", "formats"]);
        $book->delete();
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
        $extId = collect();
        $currentUserSpace = $user->files_size_byte;

        $discFiles = collect(Storage::files($relDir));
        $removeFiles = $discFiles->reject(function ($file) use ($formatCollection, $avaliableFormats, $extId) {
            $fileExt = str($file)->explode(".")->last();
            $contains = $formatCollection->contains($fileExt);
            if ($contains) {
                $extId->push($avaliableFormats->firstWhere("name", $fileExt)->id);
            }
            return $contains;
        });

        $currentUserSpace -= $removeFiles->map(fn($file) => Storage::size($file))->sum();
        Storage::delete($removeFiles->toArray());

        if (!$this->hasEnoughSpaceToUpload($user->plan, $user->files_size_byte, $files)) {
            throw new BadRequestHttpException("Not enough space for files.");
        }

        if (!empty($files)) {
            $extId = $extId->concat($this->uploadFiles($files, $relDir, $book->base_file_path));
        }
        $this->updateFormats($book, $extId->toArray());

        $currentUserSpace += $this->uploadFilesSizeByte($files);
        $user->files_size_byte = $currentUserSpace;
        $user->save();
    }

    private function setFiles(Book &$book, string $userPathName, array $data): void
    {
        $relDir = $userPathName . "/" . $book->base_file_path;

        $extId = $this->uploadFiles($data, $relDir, $book->base_file_path);
        $this->setFormats($book, $extId);
    }

    private function deleteFiles(string $userBasePath, string $fileBasePath): int
    {
        $relDir = $userBasePath . "/" . $fileBasePath;
        $deletedFilesSizeByte = collect(Storage::files($relDir))->sum(fn($file) => Storage::size($file));
        Storage::deleteDirectory($relDir);
        return $deletedFilesSizeByte;
    }

    private function isBookExist(string $title, User $user): bool
    {
        return $user->books()->where("title", $title)->get()->isNotEmpty();
    }

    private function hasEnoughSpaceToUpload(string $plan, int $userSpace, array $files): bool
    {
        $inputSizeByte = $this->uploadFilesSizeByte($files);

        $maxSpaceByte = match ($plan) {
            "limited" => 1073741824,
            "pro" => 21474836480,
        };

        $totalSizeByte = $inputSizeByte + $userSpace;
        if ($userSpace > $maxSpaceByte || $totalSizeByte > $maxSpaceByte) {
            return false;
        }
        return true;
    }

    private function uploadFilesSizeByte(array $files): int
    {
        return collect($files)->map(fn($file) => $file->getSize())->sum();
    }

    private function filterBooks(&$books, array $query): void
    {
        if (array_key_exists("filter_by", $query)) {
            collect($query["filter_by"])->transform(fn($value) => explode(":", $value))
                ->each(function ($filter) use (&$books) {
                    if ($filter[0] === "year") {
                        $books = $books->where($filter[0], $filter[1]);
                    } else {
                        $like = "%" . $filter[1] . "%";
                        $books = $books->where($filter[0], "like", $like);
                    }
                });
        }
        if (array_key_exists("sort_by", $query)) {
            $orderBy = array_key_exists("order_by", $query) ? $query["order_by"] : "asc";
            $books = $books->orderBy($query["sort_by"], $orderBy);
        }
    }
}
