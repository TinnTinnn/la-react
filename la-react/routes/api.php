<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MemberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfilePictureController;

// Route สำหรับ user ที่ต้องการ middleware
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/upload-profile-picture', [ProfilePictureController::class, 'upload'])->name('upload-profile-picture');
Route::get('/members/stats', [MemberController::class, 'memberOverview']);

Route::apiResource('members', MemberController::class );

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
//    ->middleware('throttle:login'); //middleware สำหรับ Ratelimiting
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



