<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // กำหนดตารางที่เกี่ยวข้อง
    protected $table = 'notifications';

    // กำหนดฟีลด์ที่สามารถกรอกข้อมูลได้
    protected $fillable = [
        'user_id',
        'message',
        'read_status',
    ];

    // ศ่วน Relationship กับ User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
