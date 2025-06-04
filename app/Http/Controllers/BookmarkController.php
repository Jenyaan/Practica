<?php

namespace App\Http\Controllers;

use App\Http\Services\BookmarkService;
use App\Models\Book;
use App\Models\Bookmark;
use App\Models\User;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    private $bookmarkService;

    public function __construct(BookmarkService $bookmarkService)
    {
        $this->bookmarkService = $bookmarkService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(User $user, Book $book)
    {
        return $this->bookmarkService->listBookmarks($book);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $user, Book $book)
    {
        $validated = $request->validate(["page" => "required|numeric|integer"]);
        $bookmark = $this->bookmarkService->createBookmark($book, $validated["page"]);
        return response($bookmark, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Bookmark $bookmark)
    {
        return $bookmark;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bookmark $bookmark)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bookmark $bookmark)
    {
        return $this->bookmarkService->deleteBookmark($bookmark);
    }
}
