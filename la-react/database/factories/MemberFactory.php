<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\User;
use DateInterval;
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
        $createdAt = now()->subMonths(rand(0,4));

        $expirationDate = $createdAt->copy()->addMonth(rand(1,12));
        return [
            'user_id' =>User::factory(),
            'membership_type' => $this->faker->randomElement(['Platinum', 'Gold', 'Silver', 'Bronze']),
            'member_name' => $this->faker->name(),
            'age' => $this->faker->numberBetween($min = 10, $max = 60),
            'gender' => $this->faker->randomElement(['Male', 'Female','Other']),
            'phone_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'address' => $this->faker->address(),
            'notes' => $this->faker->text(200),
            'profile_picture' => $this->faker->imageUrl(640, 480, 'people'),
            'expiration_date' => $expirationDate->format('Y-m-d'),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }
}
