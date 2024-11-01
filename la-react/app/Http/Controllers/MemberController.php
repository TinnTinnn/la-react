<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Carbon\Carbon;
use GuzzleHttp\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;


class MemberController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new \Illuminate\Routing\Controllers\Middleware(
                'auth:sanctum', except: ['index', 'show', 'memberOverview',]
            )
        ];
    }

    public function index(): JsonResponse
    {
        return response()->json(Member::with('user')->latest()->get(), 200);
    }

    public function store(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'member_name' => 'required|max:255|unique:members,member_name',
            'age'=> 'required|integer|min:10|max:80',
            'gender' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20|unique:members,phone_number',
            'email' => 'required|email|unique:members,email',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|string|max:255',
            'expiration_date' => 'required|date',
        ]);

        Log::info('Creating Member', ['data' => $fields]);

        $member = $request->user()->members()->create($fields);

        return response()->json(['member' => $member, 'user' => $member->user], 201);
    }


    public function show(Member $member): JsonResponse
    {
        return response()->json(['member' => $member, 'user' => $member->user], 200);
    }


    public function update(Request $request, Member $member): JsonResponse
    {
        Gate::authorize('modify', $member);
        $fields = $request->validate([
            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'member_name' => 'required|max:255|unique:members,member_name,' . $member->id,
            'age'=> 'required|integer|min:10|max:80',
            'gender' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20|unique:members,phone_number,' . $member->id,
            'email' => 'required|email|unique:members,email,'.$member->id,
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|string|max:255',
            'expiration_date' => 'required|date',
        ]);

        $member->update($fields);

        return response()->json(['member' => $member, 'user' => $member->user], 200);
    }

    public function memberOverview(): JsonResponse
    {
        // จำนวนสมาชิกทั้งหมด
        $totalMembers = Member::count();

        // จำนวนสมาชิกใหม่ในเดือนนี้
        $newMembers = Member::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // กำหนดวันที่วันนี้
        $today = Carbon::today();
        // จำนวนสมาชิกที่ยังไม่หมดอายุ
        $activeMembers = Member::where('expiration_date', '>', $today)->count();
        // จำนวนสมาชิกที่หมดอายุ
        $expiredMembers = Member::where('expiration_date', '<=', $today)->count();

        return response()->json([
            'totalMembers' => $totalMembers,
            'newMembers' => $newMembers,
            'activeMembers' => $activeMembers,
            'expiredMembers' => $expiredMembers,
        ], 200);
    }

    public function destroy(Member $member): JsonResponse
    {
        Gate::authorize('modify', $member);

        $member->delete();

        return response()->json(['message' => 'Member deleted'], 204);
    }
}
