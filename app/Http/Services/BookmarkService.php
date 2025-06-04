<?php

namespace App\Http\Services;

use App\Models\Book;
use App\Models\Bookmark;
use Illuminate\Pagination\AbstractPaginator;
use Ren\Http\Services\Utils\AuthUtil;

class BookmarkService
{
    private $authUtil;

    public function __construct(AuthUtil $authUtil)
    {
        $this->authUtil = $authUtil;
    }

    public function listBookmarks(Book $book): AbstractPaginator
    {
        $this->authUtil->checkUserAffiliation($book->user, "Try to get bookmark for another user");
        return $book->bookmarks->paginate();
    }

    public function createBookmark(Book $book, int $page): Bookmark
    {
        $this->authUtil->checkUserAffiliation($book->user, "Try to add bookmark for another user");
        return $book->bookmarks()->create(["page" => $page]);
    }

    public function deleteBookmark(Bookmark $bookmark): Bookmark
    {
        $this->authUtil->checkUserAffiliation($bookmark->book->user, "Try to delete bookmark for another user");
        $bookmark->delete();
        return $bookmark;
    }
}
