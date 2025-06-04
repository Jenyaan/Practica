<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Ren\Http\Services\Utils\AuthUtil;
use Smalot\PdfParser\Parser;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ReadBookController extends Controller implements HasMiddleware
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

    public function getPage(AuthUtil $authUtil, Parser $pdfParser, Book $book, int $page)
    {
        $user = $book->user;
        if(!$book->private)
        $authUtil->checkUserAffiliation($user, "Try to read book from another user");

        $pdfFile = $user->user_path_name . "/" . $book->base_file_path . "/" . $book->base_file_path . "." . "pdf";
        if (Storage::missing($pdfFile)) {
            throw new NotFoundHttpException("For reading must be uploaded pdf file");
        }

        $pdf = $pdfParser->parseContent(Storage::get($pdfFile));
        $pages = $pdf->getPages();
        $pagesCount = count($pages);
        if ($pagesCount < $page) {
            $page = $pagesCount;
        }

        $data = [];
        $data["text"] = $pages[$page - 1]->getText();
        $data["page"] = $page;
        $data["total_pages"] = $pagesCount;

        return response($data);
    }
}
