<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MemberPolicy
{

    public function modify(User $user, Member $member): Response
    {
        return $user->id === $member->user_id
            ? Response::allow()
            : Response::deny('You are not allowed to modify this member.');
    }
}
