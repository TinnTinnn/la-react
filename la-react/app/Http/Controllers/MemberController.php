<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class MemberController extends Controller
{

    public function index(): JsonResponse
    {
        return response()->json(Member::all(),200);
    }

    public function store(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member = Member::create($fields);

        return response()->json($member,201);
    }


    public function show(Member $member): JsonResponse
    {
        return response()->json($member, 200);
    }


    public function update(Request $request, Member $member): JsonResponse
    {
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member->update($fields);

        return response()->json($member, 200);
    }

    public function destroy(Member $member): JsonResponse
    {
        $member->delete();

        return response()->json(['message' => 'Member deleted'], 204);
    }
}
