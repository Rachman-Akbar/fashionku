<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\DTOs;

final readonly class RoleData
{
    public function __construct(
        public ?string $name,
        public ?string $description,
        public ?bool $isActive,
        public ?array $permissionIds,
        public bool $hasName,
        public bool $hasDescription,
        public bool $hasIsActive,
        public bool $hasPermissionIds,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            isActive: array_key_exists('is_active', $data) ? (bool) $data['is_active'] : null,
            permissionIds: $data['permission_ids'] ?? null,
            hasName: array_key_exists('name', $data),
            hasDescription: array_key_exists('description', $data),
            hasIsActive: array_key_exists('is_active', $data),
            hasPermissionIds: array_key_exists('permission_ids', $data),
        );
    }
}
