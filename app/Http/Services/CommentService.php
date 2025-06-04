<?php

namespace App\Http\Services;

use App\Models\Book;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Pagination\AbstractPaginator;
use Ren\Http\Services\Utils\AuthUtil;

class CommentService
{
    private $authUtil;

    public function __construct(AuthUtil $authUtil)
    {
        $this->authUtil = $authUtil;
    }

    public function showUserComments(User $user): AbstractPaginator
    {
        $this->authUtil->checkUserAffiliation($user, "Try to get comments for another user");

        return $user->comments()->paginate();
    }

    public function showUserBookComments(User $user, Book $book): AbstractPaginator
    {
        if (!$book->public) {
            $this->authUtil->checkUserAffiliation($user, "Try to get comments for private book");
        }

        return $book->comments()->paginate();
    }

    public function createComment(User $user, Book $book, array $data): Comment
    {
        if (!$book->public) {
            $this->authUtil->checkUserAffiliation($user, "Try to add comment for private book");
        }

        $comment = new Comment;
        foreach ($data as $key => $value) {
            $comment->$key = $value;
        }
        $comment->user()->associate($user);
        $comment->book()->associate($book);
        $comment->save();
        return $comment;
    }

    public function updateComment(Comment $comment, array $data): Comment
    {
        $user = $comment->user;
        $this->authUtil->checkUserAffiliation($user, "Try edit comment for another user");

        foreach ($data as $key => $value) {
            $comment->$key = $value;
        }

        $comment->save();
        return $comment;
    }

    public function deleteComment(Comment $comment): Comment
    {
        $user = $comment->user;
        $this->authUtil->checkUserAffiliation($user, "Try delete comment for another user");

        $comment->delete();
        return $comment;
    }
}
