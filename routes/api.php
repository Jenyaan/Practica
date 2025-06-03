<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix("v1/auth")
    ->name("auth.")
    ->group(function () {
        Route::controller(AuthController::class)
            ->middleware("auth:api")
            ->group(function () {
                Route::post("login", "login")->withoutMiddleware("auth:api")->name("login");
                Route::post("logout", "logout")->name("logout");
                Route::get("refresh", "refresh")->name("refresh");
                Route::get("me", "me")->name("me");
            });
        Route::controller(PasswordController::class)->group(function () {
            Route::post("reset-password", "resetPassword")->name("password.reset");
            Route::post("forgot-password", "forgotPassword")->name("forgot.password");
        });
    });

Route::get("v1/books/{book}/download/{format}", [DownloadController::class, "download"])->name("books.download");
Route::get("v1/books", [BookController::class, "public"])->name("books.public");

Route::apiResource("v1/users", UserController::class);
Route::apiResource("v1/users.books", BookController::class)->shallow();
