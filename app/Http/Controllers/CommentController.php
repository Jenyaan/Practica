<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Http\Services\CommentService;
use App\Models\Book;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CommentController extends Controller implements HasMiddleware
{
    private $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware("auth", except: ["index"]),
        ];
    }

    public function userComments(User $user)
    {
        $comment = $this->commentService->showUserComments($user);
        return $comment->toResourceCollection();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(User $user, Book $book)
    {
        $comment = $this->commentService->showUserBookComments($user, $book);
        return $comment->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommentRequest $request, User $user, Book $book)
    {
        $valideted = $request->validated();
        $comment = $this->commentService->createComment($user, $book, $valideted);
        return $comment->toResource()->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        return $comment->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        $valideted = $request->validated();
        $comment = $this->commentService->updateComment($comment, $valideted);
        return $comment->toResource();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        return $this->commentService->deleteComment($comment)->toResource();
    }
}
