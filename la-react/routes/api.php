<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MemberController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilePictureController;

// Route สำหรับ user ที่ต้องการ middleware
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/upload-profile-picture', [ProfilePictureController::class, 'upload'])->name('upload-profile-picture');
Route::get('/members/stats', [MemberController::class, 'memberOverview']);

// Route สำหรับ Middleware verified เส้นที่ต้องการให้ผู้ใช้ Email verified ก่อน
Route::prefix('members')->middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/stats', [MemberController::class, 'memberOverview']); // ตัวอย่าง: สถิติสมาชิก
//    Route::apiResource('', MemberController::class); // ตัวอย่าง: CRUD สำหรับ members
});
Route::apiResource('members', MemberController::class );

// Route สำหรับยืนยันอีเมลล์
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email verified successfully.']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

// Route สำหรับส่งลิงค์ยืนยันอีเมลล์อีกครั้ง (Resend)
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent!']);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');


// Public Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
//    ->middleware('throttle:login'); //middleware สำหรับ Ratelimiting
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



