<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePictureController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|file|mimes:jpeg,png,jpg|max:2048',
            'member_id' => 'required|exists:members,id',
        ]);

        $member = Member::find($request->member_id);

        if (!$member) {
            return response()->json(['error' => 'Member not found'], 404);
        }

        // ลบรูปภาพเก่าถ้ามี
        if ($member->profile_picture) {
            $oldPath = str_replace(asset('storage/'), '', $member->profile_picture);
            Storage::disk('public')->delete($oldPath);
        }

        // อััพโหลดรูปภาพใหม่
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');

        // สร้าง URL แบบเต็ม
        $fullUrl = asset('storage/' . $path);

        // ยันทึก URL ของรูปภาพลงในฐานข้อมูล
        $member->profile_picture = $fullUrl;
        $member->save();

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'profile_picture' => $fullUrl,
        ]);
    }
}
