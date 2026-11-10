<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\OtpChallenge;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentOtpChallengeRepository
{
    public function findById(string $id): ?OtpChallenge
    {
        return OtpChallenge::query()->find($id);
    }

    public function findActiveByEmailAndPurpose(string $email, string $purpose, ?string $challengeId = null): ?OtpChallenge
    {
        return OtpChallenge::query()
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->orderByDesc('created_at')
            ->first();
    }

    public function findActiveByUserIdAndPurpose(string $userId, string $purpose, ?string $challengeId = null): ?OtpChallenge
    {
        return OtpChallenge::query()
            ->where('user_id', $userId)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->orderByDesc('created_at')
            ->first();
    }

    public function countActiveByEmail(string $email, ?string $purpose = null): int
    {
        return OtpChallenge::query()
            ->where('email', $email)
            ->whereNull('consumed_at')
            ->where('expires_at', '>=', now())
            ->when($purpose, fn ($query) => $query->where('purpose', $purpose))
            ->count();
    }

    public function create(array $data): OtpChallenge
    {
        return OtpChallenge::create($data);
    }

    public function incrementAttempts(string $id): void
    {
        OtpChallenge::query()->where('id', $id)->increment('attempts');
    }

    public function markAsConsumed(string $id): void
    {
        OtpChallenge::query()->where('id', $id)->update([
            'consumed_at' => now(),
            'attempts' => DB::raw('max_attempts'),
            'updated_at' => now(),
        ]);
    }

    public function invalidateByEmailAndPurpose(string $email, string $purpose, ?string $challengeId = null): void
    {
        OtpChallenge::query()
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->whereNull('consumed_at')
            ->when($challengeId, fn ($query) => $query->where('challenge_id', $challengeId))
            ->update([
                'consumed_at' => now(),
                'updated_at' => now(),
            ]);
    }

    public function invalidateByUserId(string $userId, ?string $purpose = null): void
    {
        OtpChallenge::query()
            ->where('user_id', $userId)
            ->whereNull('consumed_at')
            ->when($purpose, fn ($query) => $query->where('purpose', $purpose))
            ->update([
                'consumed_at' => now(),
                'updated_at' => now(),
            ]);
    }

    public function cleanupExpired(): int
    {
        return OtpChallenge::query()
            ->where('expires_at', '<', now())
            ->whereNull('consumed_at')
            ->delete();
    }

    public function cleanupOldConsumed(int $days = 30): int
    {
        return OtpChallenge::query()
            ->where('consumed_at', '<', now()->subDays($days))
            ->delete();
    }
}