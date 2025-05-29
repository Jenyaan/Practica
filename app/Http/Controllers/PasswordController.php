<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\PasswordService;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    private $passwordService;

    public function __construct(PasswordService $passwordService)
    {
        $this->passwordService = $passwordService;
    }

    /* TODO
    * Сделать свой Notification для отправки писем, и отправлять чистый токен
    * либо переделать ссылку под фронтенд
    */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate(["email" => "required|email"]);
        $this->passwordService->sendResetPasswordEmail($validated);
        return response(status: 204);
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            "token" => "required",
            "email" => "required|email",
            "password" => ["required", Password::default()],
        ]);
        $this->passwordService->resetUserPassword($validated);
        return response(status: 204);
    }
}
