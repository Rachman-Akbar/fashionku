<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\SecurityEvent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentSecurityEventRepository
{
    public function create(array $data): SecurityEvent
    {
        return SecurityEvent::create($data);
    }

    public function getByUserId(string $userId, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return SecurityEvent::query()
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->orderByDesc('occurred_at')
            ->limit($limit)
            ->get();
    }

    public function getByEmail(string $email, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return SecurityEvent::query()
            ->where('email', $email)
            ->whereNull('deleted_at')
            ->orderByDesc('occurred_at')
            ->limit($limit)
            ->get();
    }

    public function countByEventTypeAndEmail(string $eventType, string $email, int $windowSeconds = 3600): int
    {
        return SecurityEvent::query()
            ->where('event_type', $eventType)
            ->where('email', $email)
            ->whereNull('deleted_at')
            ->where('occurred_at', '>=', now()->subSeconds($windowSeconds))
            ->count();
    }

    public function cleanupOld(int $days = 90): int
    {
        return SecurityEvent::query()
            ->where('occurred_at', '<', now()->subDays($days))
            ->delete();
    }
}