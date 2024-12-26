<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Notification;
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
                'auth:sanctum', except: [
                'index',
                'show',
                'memberOverview',
            ]
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

        // ส่งการแจ้งเตือนให้ User
        Notification::create([
            'user_id' => auth()->id(),
            'message'=> 'User ' . auth()->user()->name . ' Just created a new member: ' .$member->member_name,
        ]);

        // ส่ง response กลับหากสำเร็จ
        return response()->json([
            'success' => true,
            'message' => 'Member created successfully',
            'member' => $member->fresh(), // โหลดข้อมูลใหม่ของ member หลังสร้าง
            'user' => $member->user
        ], 201);
    }

    public function update(Request $request, Member $member): JsonResponse
    {
        // ตรวจสอบสิทธิ์การเข้าถึง
        Gate::authorize('modify', $member);

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
            'expiration_date' => 'required|date',
        ]);

        // เพิ่ม user_id เพื่อให้มั่นใจว่าข้อมูลเป็นของผู้ใช้งานที่ล็อกอินอยู่
        $validatedData['user_id'] = auth()->user()->id;

        // สำหรับเก็บค่า Member นั้นๆ ก่อนการเปรียบเทียบเพื่อส่งข้อมูลไป Notification
        $originalData = $member->toArray();

        try {
            // อัปเดตข้อมูลสมาชิก
            $member->update($validatedData);

            // ตรวจสอบความเปลี่ยนแปลงของ Member นั้น
            $changes = [];
            foreach ($validatedData as $key => $value) {
                if (array_key_exists($key, $originalData) && $originalData[$key] !== $value) {
                    $changes[] = ucfirst($key) . ' changed from "' . $originalData[$key] . '" to "' . $value . '"';
                }
            }

            // แจ้งเตือน
            if (!empty($changes)) {
                $message = 'User ' . auth()->user()->name . ' edited member "' .
                    $originalData['member_name'] . '". Changes: '. implode(', ', $changes);
                Notification::create([
                    'user_id' => auth()->id(),
                    'message' => $message,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Member updated successfully',
                'member' => $member,
                'user' => $member->user, // ส่งข้อมูลผู้ใช้ที่เกี่ยวข้องกลับไปด้วย
            ], 200);
        } catch (\Exception $e) {
            // จัดการข้อผิดพลาดระหว่างการอัปเดต
            Log::error('Error updating member', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update member',
            ], 500);
        }
    }


    public function memberOverview(): JsonResponse
    {
        // จำนวนสมาชิกทั้งหมด
        $totalMembers = Member::count();

        // จำนวนสมาชิกใหม่ในเดือนนี้
        $newMembers = Member::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // จำนวนสมาชิกที่สมัครวันนี้
        $todayMembers = Member::whereDay('created_at', now()->day)
            ->whereYear('created_at', now()->year)
            ->count();

        // กำหนดวันที่วันนี้
        $today = Carbon::today();
        // จำนวนสมาชิกที่ยังไม่หมดอายุ
        $activeMembers = Member::where('expiration_date', '>', $today)->count();
        // จำนวนสมาชิกที่หมดอายุ
        $expiredMembers = Member::where('expiration_date', '<=', $today)->count();

        // จำนวนสมาชิกตามประเภท
        $membershipType = Member::select('membership_type', \DB::raw('count(*) as total'))
            ->groupBy('membership_type')
            ->pluck('total', 'membership_type')
            ->toArray();

        // จำนวนสมาชิกตามช่วงอายุ
        $ageRanges = [
            '10-20' => $this->getGenderCountByAgeRange(10, 20),
            '21-30' => $this->getGenderCountByAgeRange(21, 30),
            '31-40' => $this->getGenderCountByAgeRange(31, 40),
            '41-50' => $this->getGenderCountByAgeRange(41, 50),
            '51-60' => $this->getGenderCountByAgeRange(51, 60),
        ];

        // จำนวนสมาชิกที่ลงทะบเียนในแต่ละเดือน (เริ่มตั้งแต่เดือน มกราคม)
        $registeredMember = [];
        for ($month = 1; $month <= 12; $month++) {
            $registeredMember[Carbon::create()->month($month)->format('F')] = $this->getGenderCountByMonth($month);
        }

        return response()->json([
            'totalMembers' => $totalMembers,
            'newMembers' => $newMembers,
            'todayMembers' => $todayMembers,
            'activeMembers' => $activeMembers,
            'expiredMembers' => $expiredMembers,
            'membershipType' => $membershipType,
            'ageRanges' => $ageRanges,
            'registeredMembers' => $registeredMember,
        ], 200);
    }



    // ฟังค์ชั่นเพื่อดึงข้อมูลจำนวนสมาชิกที่ลงทะเบียนในเดือนที่กำหนด
    public function getGenderCountByMonth($month)
    {
        return[
            'Male' => Member::whereMonth('created_at', $month)->where('gender', 'Male')->count(),
            'Female' => Member::whereMonth('created_at', $month)->where('gender', 'Female')->count(),
            'Other' => Member::whereMonth('created_at', $month)->where('gender', 'Other')->count(),
            'Total' => Member::whereMontH('created_at', $month)->count(),
        ];
    }

    // ฟังชั่นสำหรับดึงจำนวนสมาชิกแบบแยกตามเพศในช่วงอายุ

    public function getGenderCountByAgeRange($minAge, $maxAge)
    {
        $counts = Member::select('gender', \DB::raw('count(*) as total'))
            ->whereBetween('age', [$minAge, $maxAge])
            ->groupBy('gender')
            ->pluck('total', 'gender')
            ->toArray();

        return [
            'Male' => $counts['Male'] ?? 0,
            'Female' => $counts['Female'] ?? 0,
            'Other' => $counts['Other'] ?? 0,
            'Total' => array_sum($counts),
        ];
    }


    public function destroy(Member $member): JsonResponse
    {
        Gate::authorize('modify', $member);

        $member->delete();

        // แจ้งเตือน
        Notification::create([
            'user_id' => auth()->id(),
            'message' => 'User ' . auth()->user()->name . ' Just deleted member: '. $member->member_name,
        ]);

        return response()->json(['message' => 'Member deleted'], 204);
    }


    // ตั้งแต่ด้านล่างนี้คือส่วนที่เกี่ยวข้องกับ Notification
    // API สำหรับดึงการแจ้งเตือนทั้งหมดของ User
    public function getNotifications()
    {
        $notifications = Notification::where('user_id', auth()->id())->orderBy('created_at', 'desc')->get();
        return response()->json($notifications, 200);
    }

    public function updateNotification(Request $request, Notification $notification)
    {
        $notification->update([
            'read_status' => 1,
        ]);

        return response()->json(['success' => true], 200);
    }

}
