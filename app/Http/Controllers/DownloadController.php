<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DownloadController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware("auth"),
        ];
    }

    public function download(Book $book, string $format)
    {
        $user = $book->user;
        $filePath = $user->user_path_name . "/" . $book->base_file_path . "/" . $book->base_file_path . "." . $format;
        if (!Storage::exists($filePath)) {
            if (empty(Storage::files($filePath))) {
                throw new NotFoundHttpException("File not found");
            } else {
                throw new NotFoundHttpException("File with extension = $format not found");
            }
        }
        return Storage::download($filePath);
    }
}
