<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class PasswordController extends Controller
{
    public function requestReset(Request $request) : JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent to your email.'], 200)
            : response()->json(['error' => 'Unable to send reset link.'], 400);
    }

    public function verifyToken(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
        ]);

        // ค้นหา record จาก email
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        // ตรวจสอบว่าพบ record และ token ตรงกันหรือไม่
        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Invalid token or email.'], 400);
        }

        return response()->json(['message' => 'Token is valid.']);
    }

    public function resetPassword(Request $request) : JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = bcrypt($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password reset successfully.'],200)
            : response()->json(['error' => 'Failed to reset password.'], 400);
    }
}
