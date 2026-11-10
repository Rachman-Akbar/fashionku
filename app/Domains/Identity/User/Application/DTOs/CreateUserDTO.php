<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\DTOs;

final class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password,
        public array $roleIds,
        public ?string $firebaseUid = null,
        public ?string $avatar = null,
        public bool $isEmailVerified = false,
        public bool $isActive = true,
        public ?string $bannedAt = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) ($data['name'] ?? ''),
            email: (string) $data['email'],
            password: $data['password'] ?? null,
            roleIds: $data['role_ids'] ?? $data['roleIds'] ?? [],
            firebaseUid: $data['firebase_uid'] ?? $data['firebaseUid'] ?? null,
            avatar: $data['avatar'] ?? null,
            isEmailVerified: (bool) ($data['is_email_verified'] ?? false),
            isActive: (bool) ($data['is_active'] ?? true),
            bannedAt: $data['banned_at'] ?? null,
        );
    }
}
