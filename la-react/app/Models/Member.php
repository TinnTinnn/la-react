<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'membership_type',
        'member_name',
        'age',
        'gender',
        'phone_number',
        'email',
        'address',
        'notes',
        'profile_picture',
        'expiration_date',
    ];
    public function user() {
        return $this->belongsTo(User::class);
    }
}
