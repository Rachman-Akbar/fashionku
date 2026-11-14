<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Support\Str;

/**
 * Helpers to build realistic users for HTTP feature tests.
 *
 * The app's auth middleware (`active.role`, `role`) inspects the Sanctum token
 * `abilities` for an `active-role:{role}` entry.
 */
trait InteractsAsUser
{
    private function makeRole(string $name): Role
    {
        return Role::query()->firstOrCreate(
            ['name' => $name],
            ['description' => $name, 'is_active' => true],
        );
    }

    private function makeUser(array $attributes = [], array $roles = ['buyer']): User
    {
        $user = User::query()->create(array_merge([
            'name' => 'Test User',
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'is_email_verified' => true,
            'is_active' => true,
            'banned_at' => null,
        ], $attributes));

        $roleIds = array_map(fn (string $role): int => $this->makeRole($role)->id, $roles);
        $user->allRoles()->syncWithoutDetaching($roleIds);

        return $user->refresh();
    }

    private function tokenFor(User $user, string $activeRole): string
    {
        return $user->createToken('test', [
            'access-api',
            "active-role:{$activeRole}",
        ])->plainTextToken;
    }

    /**
     * Authenticate as a user with a given active role, returning them.
     */
    private function actingAsRole(string $role, array $attributes = []): User
    {
        $user = $this->makeUser($attributes, [$role]);
        $this->withToken($this->tokenFor($user, $role));

        return $user;
    }

    /**
     * Create a seller and authenticate as them.
     */
    private function actingAsSeller(array $userAttributes = []): User
    {
        return $this->actingAsRole('seller', $userAttributes);
    }
}