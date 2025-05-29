<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
        Password::defaults(function () {
            return Password::min(16)->letters()->numbers()->symbols();
        });
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            //TODO use frontend link
            return route("auth.password.reset") . "?token=$token";
        });
    }
}
