<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
//        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
//            // เปลี่ยน URL ให้ไปยัง REact ของเราเอง
//            $reactUrl = 'http://127.0.0.1:8000/verify-email?token=' . urlencode($url);
//
//            return (new MailMessage)
//                ->subject('Verify Email Address')
//                ->line('Click the button below to verify your email address.')
//                ->action('Verify Email Address', $reactUrl);  // ใช้ URL ที่ไปยัง React app
//        });
    }

}
