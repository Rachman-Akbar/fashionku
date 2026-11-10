<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Support\Str;

/**
 * Helpers to build realistic users/stores for HTTP feature tests.
 *
 * The app's auth middleware (`active.role`, `role`, `seller.store.available`)
 * inspects the Sanctum token `abilities` for an `active-role:{role}` entry and
 * requires a non-suspended store for sellers, so these helpers mirror the real
 * token issued by IssueApiTokenUseCase and the real seller store setup.
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
     * Fashionku is a single-store marketplace: every seller operates the one
     * main store. Reuse a shared store so seller flows match production.
     */
    private function makeStore(?User $user = null, array $attributes = []): StoreModel
    {
        $existing = StoreModel::query()->whereNull('deleted_at')->orderBy('id')->first();

        if ($existing !== null && $attributes === []) {
            return $existing;
        }

        return StoreModel::query()->create(array_merge([
            'user_id' => $user?->id ?? $this->makeUser([], ['seller'])->id,
            'name' => 'Fashionku',
            'slug' => 'fashionku-'.strtolower((string) Str::random(6)),
            'phone' => '08123456789',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'address' => 'Jl. Cihampelas No. 120',
            'status' => 'approved',
            'is_active' => true,
        ], $attributes));
    }

    /**
     * Create a seller linked to the main store and authenticate as them.
     */
    private function actingAsSeller(array $userAttributes = [], array $storeAttributes = []): array
    {
        $seller = $this->actingAsRole('seller', $userAttributes);
        $store = $this->makeStore($seller, $storeAttributes);
        $seller->unsetRelation('store');

        return [$seller, $store];
    }
}
