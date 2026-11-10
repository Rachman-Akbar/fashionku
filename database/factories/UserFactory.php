<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'name' => fake()->name(),
            'is_email_verified' => true,
            'is_active' => true,
            'banned_at' => null,
        ];
    }

    public function unverified(): static
    {
        return $this->state(['is_email_verified' => false]);
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
