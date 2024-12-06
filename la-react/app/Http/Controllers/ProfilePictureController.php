<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePictureController extends Controller
{
    public function upload(Request $request)
    {
        $isUser = $request->has('user_id');
//        $isMember = $request->has('member_id'); // ใช้ตรวจสอบค่า member_id แต่ในโค๊ดนี้ไม่ได้ใช้

        $rules = [
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];


        if ($isUser) {
                $rules['user_id'] = 'required|exists:users,id';
        } else {
            $rules['member_id'] = 'required|exists:members,id';
        }

        $request->validate($rules);

        // Entity
        $entityType = $isUser ? User::class : Member::class;
        $entityId = $isUser ? $request->user_id : $request->member_id;
        $entity = $entityType::find($entityId);

//        $member = Member::find($request->member_id);

        if (!$entity) {
            return response()->json(['error' => ($isUser ? 'User' : 'Member'). ' not found'], 404);
        }

        // ลบรูปภาพเก่าถ้ามี
        if ($entity->profile_picture) {
            $oldPath = str_replace(asset('storage/'), '', $entity->profile_picture);
            Storage::disk('public')->delete($oldPath);
        }

        // อััพโหลดรูปภาพใหม่
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');

        // สร้าง URL แบบเต็ม
        $fullUrl = asset('storage/' . $path);

        // ยันทึก URL ของรูปภาพลงในฐานข้อมูล
        $entity->profile_picture = $fullUrl;
        $entity->save();

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'profile_picture' => $fullUrl,
        ]);
    }
}
