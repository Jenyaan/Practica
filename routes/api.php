<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
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

Route::apiResource("v1/users", UserController::class);
Route::apiResource("v1/users.books", BookController::class)->shallow(); //TODO get all public books
