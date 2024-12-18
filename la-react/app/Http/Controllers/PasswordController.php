<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;

class PasswordController extends Controller
{
    public function requestReset(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent to your email.'], 200)
            : response()->json(['error' => 'Unable to send reset link.'], 400);
    }

    public function verifyToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
        ]);

        $exists = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->exists();

        return $exists
            ? response()->json(['message' => 'Token is valid.'], 200)
            : response()->json(['error' => 'Invalid token or email.'], 400);
    }

    public function resetPassword(Request $request)
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
