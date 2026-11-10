<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\UserDevice;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentUserDeviceRepository
{
    public function findById(string $id): ?UserDevice
    {
        return UserDevice::query()->find($id);
    }

    public function findByUserIdAndId(string $userId, string $deviceId): ?UserDevice
    {
        return UserDevice::query()
            ->where('user_id', $userId)
            ->where('id', $deviceId)
            ->whereNull('deleted_at')
            ->first();
    }

    public function getActiveDevicesByUserId(string $userId): \Illuminate\Database\Eloquent\Collection
    {
        return UserDevice::query()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->whereNull('deleted_at')
            ->orderByDesc('last_active_at')
            ->get();
    }

    public function getAllDevicesByUserId(string $userId): \Illuminate\Database\Eloquent\Collection
    {
        return UserDevice::query()
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->orderByDesc('last_active_at')
            ->get();
    }

    public function findBySanctumTokenId(string $tokenId): ?UserDevice
    {
        return UserDevice::query()
            ->where('sanctum_token_id', $tokenId)
            ->whereNull('deleted_at')
            ->first();
    }

    public function create(array $data): UserDevice
    {
        return UserDevice::create($data);
    }

    public function update(string $id, array $data): ?UserDevice
    {
        $device = $this->findById($id);
        if (! $device) {
            return null;
        }
        $device->update($data);
        return $device->fresh();
    }

    public function delete(string $id): bool
    {
        $device = $this->findById($id);
        if (! $device) {
            return false;
        }
        return $device->delete();
    }

    public function revokeDevice(string $id): bool
    {
        $device = $this->findById($id);
        if (! $device) {
            return false;
        }
        $device->status = 'revoked';
        $device->deleted_at = now();
        return $device->save();
    }

    public function revokeAllForUser(string $userId, ?string $exceptDeviceId = null): int
    {
        $query = UserDevice::query()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->whereNull('deleted_at');

        if ($exceptDeviceId) {
            $query->where('id', '!=', $exceptDeviceId);
        }

        $devices = $query->get();
        foreach ($devices as $device) {
            $device->status = 'revoked';
            $device->deleted_at = now();
            $device->save();
        }

        return $devices->count();
    }

    public function updateLastActive(string $id): void
    {
        UserDevice::query()->where('id', $id)->update([
            'last_active_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function cleanupExpired(): int
    {
        return UserDevice::query()
            ->where('expires_at', '<', now())
            ->whereNull('deleted_at')
            ->delete();
    }

    public function countActiveByUserId(string $userId): int
    {
        return UserDevice::query()
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->whereNull('deleted_at')
            ->count();
    }
}