<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Carbon\Carbon;
use Faker\Core\File;
use GuzzleHttp\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


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
//        dd($request->all());
        Log::info('Request data', $request->all());
        $fields = $request->validate([
//            'user_id' => 'required|exists:users,id',
            'membership_type' => 'required|max:255',
            'member_name' => 'required|max:255|unique:members,member_name',
            'age' => 'required|integer|min:10|max:80',
            'gender' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255|unique:members,phone_number',
            'email' => 'required|email|unique:members,email,',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'expiration_date' => 'required|date',
        ]);

        // กำหนด user_id จากผู้ใช้ที่ล็อกอินจะได้ไม่ต้องตรวจสอบซ้ำ
        $fields['user_id'] = auth()->user()->id;  // ดึง user_id จากการล็อกอิน

        // เอาไว้ดู log ได้ใน laravel.log
        Log::info('Creating Member', ['data' => $fields]);

        // ส่วนรับผิดชอบในการอัพโหลดไฟล์สำหรับ profile_picture
        Log::info('Profile Picture Upload Check', ['hasFile' => $request->hasFile('profile_picture')]);

        // ตรวจสอบและอัปโหลดรูปภาพ หากมีไฟล์ที่ถูกส่งมา
        if ($request->hasFile('profile_picture') && $request->file('profile_picture')->isValid()) {
            try {
                // อัปโหลดไฟล์
                $path = $request->file('profile_picture')->store('profile_pictures', 'public');
                $fields['profile_picture'] = asset('storage/' . $path);
                Log::info('Profile Picture Path', ['profile_picture' => $fields['profile_picture']]);
            } catch (\Exception $e) {
                // Log และส่ง error หากอัปโหลดไม่สำเร็จ
                Log::error('Failed to upload profile picture', ['error' => $e->getMessage()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload profile picture',
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            // หากไม่มีไฟล์ที่ถูกส่งมา ให้ตั้งค่า profile_picture เป็น null
            $fields['profile_picture'] = null;
        }

        // สร้าง Member ใหม่
        try {
            $member = $request->user()->members()->create($fields);
            Log::info('Member created', ['member' => $member]);
        } catch (\Exception $e) {
            // Log และส่ง error หากการสร้าง Member ล้มเหลว
            Log::error('Failed to create member', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create member',
                'error' => $e->getMessage()
            ], 500);
        }

        // ส่ง response กลับหากสำเร็จ
        return response()->json([
            'success' => true,
            'message' => 'Member created successfully',
            'member' => $member->fresh(), // โหลดข้อมูลใหม่ของ member หลังสร้าง
            'user' => $member->user
        ], 201);
    }

    public function show(Member $member): JsonResponse
    {
        return response()->json(['member' => $member, 'user' => $member->user], 200);
    }


    public function update(Request $request, Member $member): JsonResponse
    {
        // ตรวจสอบสิทธิ์การเข้าถึง
        Gate::authorize('modify', $member);
        Log::info('Raw input:', ['raw' => file_get_contents('php://input')]);
        Log::info('Update Member Request', ['request' => $request->all()]);

        // ตรวจสอบข้อมูลที่ได้รับจากฟอร์ม
        $validatedData = $request->validate([
            'membership_type' => 'required|max:255',
            'member_name' => 'required|max:255|unique:members,member_name,' . $member->id,
            'age' => 'required|integer|min:10|max:80',
            'gender' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255|unique:members,phone_number,' . $member->id,
            'email' => 'required|email|unique:members,email,' . $member->id,
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'expiration_date' => 'required|date',
        ]);

        // กำหนด user_id จากผู้ใช้ที่ล็อกอิน
        $validatedData['user_id'] = auth()->user()->id;

        // ตรวจสอบการอัปโหลดไฟล์โปรไฟล์
        if ($request->hasFile('profile_picture')) {
            $profilePicture = $request->file('profile_picture');

            // ตรวจสอบว่าไฟล์ที่อัปโหลดไม่ว่าง
            if ($request->hasFile('profile_picture')) {
                $profilePicture = $request->file('profile_picture');
                if ($profilePicture->isValid()) {
                    if ($member->profile_picture) {
                        Storage::disk('public')->delete($member->profile_picture);
                    }

                    $validatedData['profile_picture'] = $profilePicture->store('profile_pictures', 'public');
                } else {
                    return response()->json(['message' => 'Invalid profile picture'], 400);
                }
            }

            try {
                $member->update($validatedData);
            } catch (\Exception $e) {
                Log::error('Error updating member', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Failed to update member'], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Member updated successfully',
                'member' => $member,
                'user' => $member->user,
            ]);
        }

        // ตรวจสอบข้อมูลที่ต้องการอัปเดต
        Log::info('Fields for Update', ['fields' => $validatedData]);

        // update ข้อมูลสมาชิก
        try {
            $member->update($validatedData);
            Log::info('Member updated successfully', ['member' => $member]);
        } catch (\Exception $e) {
            Log::error('Error updating member', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Failed to update member'], 500);
        }

        // ส่งข้อมูลสมาชิกที่อัปเดต
        return response()->json([
            'success' => true,
            'message' => 'Member updated successfully',
            'member' => $member,
            'user' => $member->user,  // ข้อมูลผู้ใช้ที่เกี่ยวข้อง
        ], 200);
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
