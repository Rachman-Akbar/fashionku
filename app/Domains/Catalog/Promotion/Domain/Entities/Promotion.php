<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Domain\Entities;

final class Promotion
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
}
