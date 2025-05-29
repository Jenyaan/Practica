<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Pagination\AbstractPaginator;
use Ren\Http\Services\Utils\AuthUtil;

class UserService
{
    private $authUtil;

    public function __construct(AuthUtil $authUtil)
    {
        $this->authUtil = $authUtil;
    }

    public function listUserResources(): AbstractPaginator
    {
        return User::paginate();
    }

    public function createUser(array $data): User
    {
        $user = User::create($data);
        $user->refresh();
        return $user;
    }

    public function updateUser(array $data, User $user): User
    {
        $this->authUtil->checkUserAffiliation($user, "Try to update another user");
        foreach ($data as $key => $value) {
            $user->$key = $value;
        }
        $user->save();
        return $user;
    }

    public function deleteUser(User $user): void
    {
        $this->authUtil->checkUserAffiliation($user, "Try to delete another user");
        $user->delete();
    }
}
