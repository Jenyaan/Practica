<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $userService)
    {
        $this->authService = $userService;
    }

    /**
     * Get a JWT via given credentials.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);
        return response($this->authService->loginUser($validated));
    }

    /**
     * Get the authenticated User.
     */
    public function me()
    {
        $user = $this->authService->getAuthUser();
        return $user->toResource();
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout()
    {
        $this->authService->logout();
        return response(status: 204);
    }

    /**
     * Refresh a token.
     */
    public function refresh()
    {
        return response($this->authService->refreshUserToken());
    }
}
