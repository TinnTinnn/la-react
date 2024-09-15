<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Member;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
         User::factory(20)->create();

         foreach (User::all() as $user){
             Member::factory()->create([
                 'user_id' => $user->id,
             ]);
         }
         Admin::factory(2)->create();
    }
}
