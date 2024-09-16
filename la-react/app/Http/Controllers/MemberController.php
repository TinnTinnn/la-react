<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;


class MemberController extends Controller
{

    public function index()
    {
        return Member::all();
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member = Member::create($fields);

        return $member;
    }


    public function show(Member $member)
    {
        return $member;
    }


    public function update(Request $request, Member $member)
    {
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member->update($fields);

        return $member;
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return ['message' => 'Member deleted'];
    }
}
