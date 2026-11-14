<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Application\DTOs\UpdateUserDTO;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Laravel\Sanctum\PersonalAccessToken;
use LogicException;
use RuntimeException;

final class EloquentUserRepository implements UserRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('roles:id,name,is_active')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function findById(string $id): ?User
    {
        return User::query()
            ->with('roles:id,name,is_active')
            ->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()
            ->active()
            ->whereNull('banned_at')
            ->where('email', Str::lower(trim($email)))
            ->first();
    }

    public function findAnyByEmail(string $email): ?User
    {
        return User::withTrashed()
            ->where('email', Str::lower(trim($email)))
            ->first();
    }

    public function findByFirebaseUid(string $firebaseUid): ?User
    {
        return User::query()
            ->active()
            ->whereNull('banned_at')
            ->where('firebase_uid', trim($firebaseUid))
            ->first();
    }

    public function findAnyByFirebaseUid(string $firebaseUid): ?User
    {
        return User::withTrashed()
            ->where('firebase_uid', trim($firebaseUid))
            ->first();
    }

    public function create(CreateUserDTO $dto): User
    {
        return DB::transaction(function () use ($dto): User {
            $user = new User;
            $user->id = (string) Str::uuid();
            $user->forceFill([
                'email' => $dto->email,
                'password' => $dto->password ? Hash::make($dto->password) : null,
                'has_set_password' => (bool) $dto->password,
                'name' => trim($dto->name),
                'firebase_uid' => $dto->firebaseUid ? trim($dto->firebaseUid) : null,
                'avatar' => $dto->avatar,
                'is_email_verified' => $dto->isEmailVerified,
                'is_active' => $dto->isActive,
                'banned_at' => $dto->bannedAt,
            ]);
            $user->save();

            if ($dto->roleIds !== []) {
                $user->roles()->sync($this->activeRoleIds($dto->roleIds));
            }

            return $user->refresh()->load('roles:id,name,is_active');
        });
    }

    public function update(string $id, UpdateUserDTO $dto): ?User
    {
        $user = $this->findById($id);

        if (! $user) {
            return null;
        }

        DB::transaction(function () use ($user, $dto): void {
            $updateData = [];

            if ($dto->email !== null) {
                $updateData['email'] = $dto->email;
            }

            if ($dto->password !== null) {
                $updateData['password'] = Hash::make($dto->password);
                $updateData['has_set_password'] = true;
            }

            if ($dto->name !== null) {
                $updateData['name'] = trim($dto->name);
            }

            if ($dto->firebaseUid !== null) {
                $updateData['firebase_uid'] = trim($dto->firebaseUid);
            }

            if ($dto->avatar !== null) {
                $updateData['avatar'] = $dto->avatar;
            }

            if ($dto->isEmailVerified !== null) {
                $updateData['is_email_verified'] = $dto->isEmailVerified;
            }

            if ($dto->isActive !== null) {
                $updateData['is_active'] = $dto->isActive;
            }

            if ($dto->hasBannedAt) {
                $updateData['banned_at'] = $dto->bannedAt;
            }

            if ($updateData !== []) {
                $user->forceFill($updateData)->save();
            }

            if ($dto->roleIds !== null) {
                $user->roles()->sync($this->activeRoleIds($dto->roleIds));
            }

            if ($dto->isActive === false || ($dto->hasBannedAt && $dto->bannedAt !== null)) {
                $user->tokens()->delete();
            }
        });

        return $user->refresh()->load('roles:id,name,is_active');
    }

    public function delete(string $id): bool
    {
        $user = User::query()->find($id);

        if (! $user) {
            return false;
        }

        return DB::transaction(function () use ($user): bool {
            $user->tokens()->delete();
            $user->roles()->detach();

            return (bool) $user->delete();
        });
    }

    public function deleteCurrentToken(User $user): void
    {
        $token = $user->currentAccessToken();

        if ($token instanceof PersonalAccessToken || (is_object($token) && method_exists($token, 'delete'))) {
            $token->delete();
        }
    }

    public function syncFromFirebase(array $firebaseUser): User
    {
        return DB::transaction(function () use ($firebaseUser): User {
            $firebaseUid = trim((string) ($firebaseUser['uid'] ?? $firebaseUser['sub'] ?? ''));
            $email = Str::lower(trim((string) ($firebaseUser['email'] ?? '')));

            if ($firebaseUid === '' || $email === '') {
                throw new InvalidArgumentException('Data Firebase UID atau email tidak valid.');
            }

            $providerName = trim((string) ($firebaseUser['name'] ?? ''));
            $providerAvatar = trim((string) ($firebaseUser['picture'] ?? ''));
            $isEmailVerified = (bool) ($firebaseUser['email_verified'] ?? true);
            $user = $this->findAnyByFirebaseUid($firebaseUid);

            if ($user !== null) {
                $this->assertUserCanAuthenticate($user);
                $updates = [
                    'is_email_verified' => $user->is_email_verified || $isEmailVerified,
                ];

                if (! $user->name && $providerName !== '') {
                    $updates['name'] = $providerName;
                }

                if (! $user->avatar && $providerAvatar !== '') {
                    $updates['avatar'] = $providerAvatar;
                }

                $user->forceFill($updates)->save();
                $this->assignRoleByName($user, 'buyer');

                return $user->refresh()->load('roles:id,name,is_active');
            }

            $user = $this->findAnyByEmail($email);

            if ($user !== null) {
                $this->assertUserCanAuthenticate($user);

                if ($user->firebase_uid !== null && $user->firebase_uid !== $firebaseUid) {
                    throw new LogicException('Email ini telah terhubung dengan akun Google yang berbeda.');
                }

                $updates = [
                    'firebase_uid' => $firebaseUid,
                    'is_email_verified' => $user->is_email_verified || $isEmailVerified,
                ];

                if (! $user->name && $providerName !== '') {
                    $updates['name'] = $providerName;
                }

                if (! $user->avatar && $providerAvatar !== '') {
                    $updates['avatar'] = $providerAvatar;
                }

                $user->forceFill($updates)->save();
                $this->assignRoleByName($user, 'buyer');

                return $user->refresh()->load('roles:id,name,is_active');
            }

            $user = new User;
            $user->id = (string) Str::uuid();
            $user->forceFill([
                'firebase_uid' => $firebaseUid,
                'email' => $email,
                'password' => Hash::make(Str::random(40)),
                'has_set_password' => false,
                'name' => $providerName !== '' ? $providerName : Str::before($email, '@'),
                'avatar' => $providerAvatar !== '' ? $providerAvatar : null,
                'is_email_verified' => $isEmailVerified,
                'is_active' => true,
                'banned_at' => null,
            ]);
            $user->save();
            $this->assignRoleByName($user, 'buyer');

            return $user->refresh()->load('roles:id,name,is_active');
        });
    }

    public function resolveDefaultActiveRole(User $user): ?string
    {
        $roles = $user->roleNames();

        if (in_array('buyer', $roles, true)) {
            return 'buyer';
        }

        return $roles[0] ?? null;
    }

    public function hasSellerAccess(User $user): bool
    {
        // Single-store: admin adalah seller/operator yang sama.
        return $user->is_active && ! $user->isBanned() && ($user->hasRole('seller') || $user->hasRole('admin'));
    }

    public function assignRoleByName(User $user, string $role): void
    {
        $roleName = Str::lower(trim($role));
        $roleId = DB::table('roles')
            ->where('name', $roleName)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        if ($roleId === null) {
            throw new RuntimeException("Role [{$roleName}] tidak ditemukan atau tidak aktif.");
        }

        DB::table('user_roles')->updateOrInsert(
            ['user_id' => $user->id, 'role_id' => $roleId],
            ['created_at' => now(), 'updated_at' => now()]
        );

        $user->unsetRelation('roles');
    }

    public function getActiveRoleFromCurrentToken(User $user): ?string
    {
        $token = $user->currentAccessToken();

        if (! $token instanceof PersonalAccessToken) {
            return null;
        }

        foreach ($token->abilities ?? [] as $ability) {
            if (is_string($ability) && str_starts_with($ability, 'active-role:')) {
                $role = Str::lower(str_replace('active-role:', '', $ability));

                return $user->hasRole($role) ? $role : null;
            }
        }

        return null;
    }

    public function logoutOtherDevices(User $user): int
    {
        $currentTokenId = $user->currentAccessToken()?->id;
        $query = $user->tokens();

        if ($currentTokenId !== null) {
            $query->where('id', '!=', $currentTokenId);
        }

        return $query->delete();
    }

    private function activeRoleIds(array $roleIds): array
    {
        return DB::table('roles')
            ->whereIn('id', array_map('intval', $roleIds))
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->pluck('id')
            ->map(fn (mixed $id): int => (int) $id)
            ->all();
    }

    private function assertUserCanAuthenticate(User $user): void
    {
        if ($user->trashed()) {
            throw new RuntimeException('Akun telah dihapus.');
        }

        if (! $user->is_active) {
            throw new RuntimeException('Akun sedang nonaktif.');
        }

        if ($user->isBanned()) {
            throw new RuntimeException('Akun sedang diblokir.');
        }
    }
}
