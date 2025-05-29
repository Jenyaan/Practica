<?php

namespace App\Http\Services;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Ren\Http\Services\Utils\AuthUtil;

class UserService
{
    private $authUtil;

    public function __construct(AuthUtil $authUtil)
    {
        $this->authUtil = $authUtil;
    }

    public function listUserResources()
    {
        return User::paginate()->toResourceCollection();
    }

    public function createUser(StoreUserRequest $request)
    {
        $user = User::create([
            "name" => $request->input("name"),
            "surname" => $request->input("surname"),
            "email" => $request->input("email"),
            "password" => $request->input("password"),
            "phone" => $request->input("phone"),
            "image_base64" => $request->input("image_base64"),
            "contacts" => $request->input("contacts"),
            "addresses" => $request->input("addresses"),
        ]);
        return $user->toResource();
    }

    /**
     * Get user as recource
     */
    public function getUserResource(User $user)
    {
        return $user->toResource();
    }

    public function updateUser(UpdateUserRequest $request, User $user)
    {
        $this->authUtil->checkUserAffiliation($user, "Try to update another user");
        $request->whenHas("name", fn() => $user->name = $request->input("name"));
        $request->whenHas("surname", fn() => $user->surname = $request->input("surname"));
        $request->whenHas("password", fn() => $user->password = $request->input("password"));
        $request->whenHas("phone", fn() => $user->phone = $request->input("phone"));
        $request->whenHas("email", fn() => $user->email = $request->input("email"));
        $request->whenHas("image_base64", fn() => $user->image_base64 = $request->input("image_base64"));
        $request->whenHas("contacts", fn() => $user->contacts = $request->input("contacts"));
        $request->whenHas("addresses", fn() => $user->addresses = $request->input("addresses"));
        $user->save();
        return $user->toResource();
    }

    public function deleteUser(User $user)
    {
        $this->authUtil->checkUserAffiliation($user, "Try to delete another user");
        $user->delete();
        return $user->toResource();
    }
}
