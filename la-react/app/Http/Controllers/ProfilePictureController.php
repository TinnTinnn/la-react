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
        // Validate request
        $isUser = $request->has('user_id');
        $rules = [
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            $isUser ? 'user_id' : 'member_id' => 'required|exists:' . ($isUser ? 'users' : 'members') . ',id',
        ];
        $request->validate($rules);

        // Find entity (User or Member)
        $entityType = $isUser ? User::class : Member::class;
        $entityId = $isUser ? $request->user_id : $request->member_id;
        $entity = $entityType::findOrFail($entityId); // ถ้าไม่เจอจะ throw 404 อัตโนมัติ

        // Upload profile picture to S3
        $file = $request->file('profile_picture');
        $disk = Storage::disk('s3');

        // Delete old picture if exists
        if ($entity->profile_picture) {
            $oldPath = ltrim(parse_url($entity->profile_picture, PHP_URL_PATH), '/');
            if ($disk->exists($oldPath)) {
                $disk->delete($oldPath);
            }
        }

        // Upload new picture
        try {
            $path = $disk->putFileAs('profile_pictures', $file, time() . '-' . $file->getClientOriginalName());
            if (!$path) {
                return response()->json([
                    'error' => 'Failed to upload profile picture',
                    'message' => 'Could not upload to S3'
                ], 500);
            }

            // Save new URL and return response
            $fullUrl = $disk->url($path);
            $entity->profile_picture = $fullUrl;
            $entity->save();

            return response()->json([
                'message' => 'Profile picture updated successfully',
                'profile_picture' => $fullUrl,
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'Failed to upload profile picture',
                'message' => 'An error occurred while uploading to S3'
            ], 500);
        }
    }
}
