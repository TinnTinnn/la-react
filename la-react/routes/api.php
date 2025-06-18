<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilePictureController;

// Route สำหรับ user ที่ต้องการ middleware
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route for Upload picture and member stat and other for next time
Route::post('/upload-profile-picture', [ProfilePictureController::class, 'upload'])->name('upload-profile-picture');
Route::get('/members/stats', [MemberController::class, 'memberOverview']);

//  Route for Crud control
Route::apiResource('members', MemberController::class );


// Route for  Register ,login , logout without middleware validate
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
//    ->middleware('throttle:login'); //middleware สำหรับ Ratelimiting
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


// Route for reset password

// Request reset link
Route::post('/password/request-reset', [PasswordConTroller::class, 'requestReset'])
->middleware('throttle:3,1');

// Verify token (optional, เลือกได้ว่าอยากให้ตรวจสอบก่อนมั้ย๗
Route::post('/password/verify-token', [PasswordController::class, 'verifyToken']);

// Reset password
Route::post('/password/reset', [PasswordController::class, 'resetPassword']);

// API เส้นสำหรับส่วนการแจ้งเตือน
Route::middleware('auth:sanctum')->get('/notifications', [MemberController::class, 'getNotifications']);
Route::middleware('auth:sanctum')->put('/notifications/{notification}', [MemberController::class, 'updateNotification']);

// DEV ONLY: Seed members endpoint (remove after use)
// Route::post('/seed-members', [MemberController::class, 'seedMembers']);
