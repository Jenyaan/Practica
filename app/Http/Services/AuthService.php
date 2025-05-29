<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;

class AuthService
{
    public function loginUser(array $validated): array
    {
        if (!$token = auth()->attempt($validated)) {
            throw new AuthenticationException();
        }
        return $this->respondWithToken($token);
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout()
    {
        auth()->logout();
    }

    /**
     * Get the authenticated User.
     */
    public function getAuthUser() : User
    {
        return auth()->user();
    }

    /**
     * Refresh a token.
     */
    public function refreshUserToken() : array
    {
        return $this->respondWithToken(auth()->refresh());
    }

    protected function respondWithToken($token) : array
    {
        return [
            "access_token" => $token,
            "token_type" => "bearer",
            "expires_in" => auth()->factory()->getTTL(),
        ];
    }
}
