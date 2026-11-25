<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Dtos;

final class PromotionData
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $imageUrl,
        public ?string $mobileImageUrl,
        public string $clickAction,
        public ?int $targetId,
        public ?string $targetUrl,
        public int $sortOrder,
        public bool $isActive,
        public ?array $createdByUser = null,
        public ?array $updatedByUser = null,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            name: trim((string) preg_replace('/\s+/u', ' ', (string) ($data['name'] ?? ''))),
            imageUrl: trim((string) ($data['image_url'] ?? '')),
            mobileImageUrl: self::nullableString($data['mobile_image_url'] ?? null),
            clickAction: (string) ($data['click_action'] ?? 'none'),
            targetId: isset($data['target_id']) && $data['target_id'] !== null ? (int) $data['target_id'] : null,
            targetUrl: self::nullableString($data['target_url'] ?? null),
            sortOrder: (int) ($data['sort_order'] ?? 0),
            isActive: (bool) ($data['is_active'] ?? true),
            createdByUser: $data['created_by_user'] ?? null,
            updatedByUser: $data['updated_by_user'] ?? null,
            createdAt: $data['created_at'] ?? null,
            updatedAt: $data['updated_at'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image_url' => $this->imageUrl,
            'mobile_image_url' => $this->mobileImageUrl,
            'click_action' => $this->clickAction,
            'target_id' => $this->targetId,
            'target_url' => $this->targetUrl,
            'sort_order' => $this->sortOrder,
            'is_active' => $this->isActive,
            'created_by_user' => $this->createdByUser,
            'updated_by_user' => $this->updatedByUser,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        $value = trim((string) ($value ?? ''));

        return $value === '' ? null : $value;
    }
}
