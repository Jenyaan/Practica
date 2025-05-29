<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PasswordService
{
    /**
     * Send email to user for reset password
     */
    public function sendResetPasswordEmail(array $validated): void
    {
        $status = Password::sendResetLink($validated);
        if ($status !== Password::ResetLinkSent) {
            throw new BadRequestHttpException($status);
        }
    }

    /**
     * Reset user password
     */
    public function resetUserPassword(array $validated): void
    {
        $status = Password::reset(
            $validated,
            function (User $user, string $password) {
                $user->password = $password;
                $user->save();
            }
        );
        if ($status !== Password::PasswordReset) {
            throw new BadRequestHttpException($status);
        }
        
    }
}
