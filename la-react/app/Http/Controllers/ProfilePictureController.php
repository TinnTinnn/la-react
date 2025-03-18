<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        try {
            // Debug file
            $file = $request->file('profile_picture');
            Log::info('File details', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType()
            ]);

            // Debug S3 config
            $s3Config = config('filesystems.disks.s3');
            Log::info('S3 Config', [
                'key' => $s3Config['key'],
                'secret' => $s3Config['secret'] ? '****' : null,
                'region' => $s3Config['region'],
                'bucket' => $s3Config['bucket'],
                'env_vars' => [
                    'AWS_ACCESS_KEY_ID' => env('AWS_ACCESS_KEY_ID'),
                    'AWS_SECRET_ACCESS_KEY' => env('AWS_SECRET_ACCESS_KEY') ? '****' : null,
                    'AWS_DEFAULT_REGION' => env('AWS_DEFAULT_REGION'),
                    'AWS_BUCKET' => env('AWS_BUCKET')
                ]
            ]);

            // Test S3 connection
            $disk = Storage::disk('s3');
            try {
                $testPath = 'test-' . time() . '.txt';
                $disk->put($testPath, 'test content');
                $exists = $disk->exists($testPath);
                $disk->delete($testPath);
                Log::info('S3 Connection Test', ['can_write' => $exists]);
            } catch (\Exception $e) {
                Log::error('S3 Connection Failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw new \Exception('S3 connection failed: ' . $e->getMessage());
            }

            // ลบรูปภาพเก่าถ้ามี
            if ($entity->profile_picture) {
                $oldPath = parse_url($entity->profile_picture, PHP_URL_PATH);
                $oldPath = ltrim($oldPath, '/');
                if ($oldPath && $disk->exists($oldPath)) {
                    $disk->delete($oldPath);
                }
            }

            // อัปโหลดรูปภาพใหม่
            $fileName = 'profile_pictures/' . time() . '-' . $file->getClientOriginalName();
            $uploaded = $disk->put($fileName, file_get_contents($file), 'public');
            Log::info('S3 Upload Result', ['uploaded' => $uploaded, 'file_name' => $fileName]);
            if (!$uploaded) {
                throw new \Exception('Failed to upload to S3');
            }
            $fullUrl = $disk->url($fileName);
            $entity->profile_picture = $fullUrl;
            $entity->save();

            return response()->json([
                'message' => 'Profile picture updated successfully',
                'profile_picture' => $fullUrl,
            ]);
        } catch (\Exception $e) {
            Log::error('Profile picture upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to upload profile picture',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
