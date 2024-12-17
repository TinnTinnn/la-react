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
    Route::apiResource('', MemberController::class); // ตัวอย่าง: CRUD สำหรับ members
});

// Route รวม สำหรับ Crud โดยอันนี้ไม่เข้า Middleware
//Route::apiResource('members', MemberController::class);


// Route api สำหรับเช็คค่า isVerified
Route::middleware(['auth:sanctum'])->get('/user/status', function (Request $request) {
    return response()->json([
        'isVerified' => $request->user()->hasVerifiedEmail()
    ]);
});


// Route สำหรับยืนยันอีเมลล์ เมื่อ User Register
//Route::get('/email/verify', [AuthController::class, 'verifyNotice'])->name
//('verification.notice');

// Route สำหรับ User ได้ Email แล้ว กด verify
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])->name('verification.verify');

// Route สำหรับส่งลิงค์ยืนยันอีเมลล์อีกครั้ง (Resend)
Route::post('/email/verification-notification',[AuthController::class, 'verifyHandler'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');


// Public Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
//    ->middleware('throttle:login'); //middleware สำหรับ Ratelimiting
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



