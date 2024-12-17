<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:3|confirmed',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
        ]);

        // สำหรับ เพื่อเรียกใช้งาน Register event ของ Email verification
        event(new Registered($user));

        $token = $user->createToken($request->name);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ],201);
    }

    // Verify Email Notice handler
    public function verifyNotice ()
    {
        return redirect('http://127.0.0.1:8000/api/');
    }

    // Email Verification handler
    public function verifyEmail (EmailVerificationRequest $request)
    {
        $request->fulfill();

        return redirect('http://127.0.0.1:8000/api/');
    }

    // Resending the Verification Email Handler
    public  function verifyHandler (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification link sent!']);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'email' => ['The provided credentials are incorrect.'],
                ],
            ], 401);
        }



        $token = $user->createToken($user->name);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
       $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully'], 204);
    }
}
