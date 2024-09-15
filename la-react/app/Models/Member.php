<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'membership_type',
        'expiration_date',
        'user_id'
    ];
    public function user() {
        return $this->belongsTo(User::class);
    }
}
