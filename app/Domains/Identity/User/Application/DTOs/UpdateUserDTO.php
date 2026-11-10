<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\DTOs;

final class UpdateUserDTO
{
    public function __construct(
        public ?string $email = null,
        public ?string $password = null,
        public ?string $name = null,
        public ?string $firebaseUid = null,
        public ?string $avatar = null,
        public ?bool $isEmailVerified = null,
        public ?array $roleIds = null,
        public ?bool $isActive = null,
        public ?string $bannedAt = null,
        public bool $hasBannedAt = false,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'] ?? null,
            password: $data['password'] ?? null,
            name: $data['name'] ?? null,
            firebaseUid: $data['firebase_uid'] ?? $data['firebaseUid'] ?? null,
            avatar: $data['avatar'] ?? null,
            isEmailVerified: array_key_exists('is_email_verified', $data)
                ? (bool) $data['is_email_verified']
                : null,
            roleIds: $data['role_ids'] ?? $data['roleIds'] ?? null,
            isActive: array_key_exists('is_active', $data)
                ? (bool) $data['is_active']
                : null,
            bannedAt: $data['banned_at'] ?? null,
            hasBannedAt: array_key_exists('banned_at', $data),
        );
    }
}
