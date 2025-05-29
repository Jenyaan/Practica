<?php

namespace Ren\Http\Services\Utils;

use App\Models\User;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class AuthUtil
{
    public function checkUserAffiliation(User $user, string $message)
    {
        if (auth()->user()->id != $user->id) {
            throw new AccessDeniedHttpException($message);
        }
    }
}
