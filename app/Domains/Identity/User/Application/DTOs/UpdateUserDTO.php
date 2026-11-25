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
        public bool $hasAvatar = false,
    ) {}

    public static function fromArray(array $data): self
    {
        $hasAvatar = array_key_exists('avatar', $data);
        $avatar = $hasAvatar && is_string($data['avatar']) ? trim($data['avatar']) : null;

        return new self(
            email: $data['email'] ?? null,
            password: $data['password'] ?? null,
            name: $data['name'] ?? null,
            firebaseUid: $data['firebase_uid'] ?? $data['firebaseUid'] ?? null,
            avatar: $avatar === '' ? null : $avatar,
            isEmailVerified: array_key_exists('is_email_verified', $data)
                ? (bool) $data['is_email_verified']
                : null,
            roleIds: $data['role_ids'] ?? $data['roleIds'] ?? null,
            isActive: array_key_exists('is_active', $data)
                ? (bool) $data['is_active']
                : null,
            hasAvatar: $hasAvatar,
        );
    }
}
