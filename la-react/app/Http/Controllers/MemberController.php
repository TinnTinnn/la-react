<?php

namespace App\Http\Controllers;

use App\Models\Member;
use GuzzleHttp\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Gate;


class MemberController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new \Illuminate\Routing\Controllers\Middleware('auth:sanctum', except: ['index', 'show'])
        ];
    }

    public function index(): JsonResponse
    {
        return response()->json(Member::with('user')->latest()->get(),200);
    }

    public function store(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member = $request->user()->members()->create($fields);

        return response()->json(['member' => $member,'user' => $member->user], 201);
    }


    public function show(Member $member): JsonResponse
    {
        return response()->json(['member' => $member,'user' => $member->user], 200);
    }


    public function update(Request $request, Member $member): JsonResponse
    {
        Gate::authorize('modify', $member);
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member->update($fields);

        return response()->json(['member' => $member, 'user' => $member->user], 200);
    }

    public function destroy(Member $member): JsonResponse
    {
        Gate::authorize('modify', $member);

        $member->delete();

        return response()->json(['message' => 'Member deleted'], 204);
    }
}
