<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    protected $model = Member::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' =>User::factory(),
            'membership_type' => $this->faker->randomElement(['Platinum', 'Gold', 'Silver', 'Bronze']),
            'expiration_date' => $this->faker->dateTimeBetween('2025-01-01', '2035-12-31')->format('Y-m-d'),
        ];
    }
}
