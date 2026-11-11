<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\Auth\Infrastructure\Persistence\Models\RegistrationChallenge;

final class EloquentRegistrationChallengeRepository
{
    public function findById(string $id): ?RegistrationChallenge
    {
        return RegistrationChallenge::query()->find($id);
    }

    public function findByEmail(string $email): ?RegistrationChallenge
    {
        return RegistrationChallenge::query()
            ->where('email', $email)
            ->whereNull('deleted_at')
            ->first();
    }

    public function findByOtpChallengeId(string $otpChallengeId): ?RegistrationChallenge
    {
        return RegistrationChallenge::query()
            ->where('otp_challenge_id', $otpChallengeId)
            ->whereNull('deleted_at')
            ->first();
    }

    public function findActiveByEmail(string $email): ?RegistrationChallenge
    {
        return RegistrationChallenge::query()
            ->where('email', $email)
            ->whereNull('deleted_at')
            ->where('expires_at', '>=', now())
            ->first();
    }

    public function findActiveByEmailForUpdate(string $email): ?RegistrationChallenge
    {
        return RegistrationChallenge::query()
            ->where('email', $email)
            ->whereNull('deleted_at')
            ->where('expires_at', '>=', now())
            ->lockForUpdate()
            ->first();
    }

    public function create(array $data): RegistrationChallenge
    {
        return RegistrationChallenge::create($data);
    }

    public function update(string $id, array $data): ?RegistrationChallenge
    {
        $challenge = $this->findById($id);
        if (! $challenge) {
            return null;
        }
        $challenge->update($data);
        return $challenge->fresh();
    }

    public function delete(string $id): bool
    {
        $challenge = $this->findById($id);
        if (! $challenge) {
            return false;
        }
        return $challenge->delete();
    }

    public function cleanupExpired(): int
    {
        return RegistrationChallenge::query()
            ->where('expires_at', '<', now())
            ->whereNull('deleted_at')
            ->delete();
    }
}