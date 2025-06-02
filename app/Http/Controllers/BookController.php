<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Services\BookService;
use App\Models\Book;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BookController extends Controller implements HasMiddleware
{
    private $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware("auth"),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(User $user)
    {
        return $this->bookService->listUserBooks($user)->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(User $user, StoreBookRequest $request)
    {
        $validated = $request->validated();
        $book = $this->bookService->createBook($validated, $user);
        return $book->toResource()->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        return $book->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        $validated = $request->validated();
        $book = $this->bookService->updateBook($book, $validated);
        return $book->toResource();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        //
    }
}
