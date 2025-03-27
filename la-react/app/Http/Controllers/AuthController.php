<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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

        

        $token = $user->createToken($request->name);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
        ],201);
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
       try {
           $request->user()->tokens()->delete();
           Log::info('User logged out successfully', ['user_id' => $request->user()->id]);
           return response()->json(['message' => 'Logged out successfully'], 200);
       } catch (\Exception $e) {
           Log::error('Error during logout', [
               'user_id' => $request->user()->id,
               'error' => $e->getMessage()
           ]);
           return response()->json(['error' => 'Logout failed'], 500);
       }
    }
}
