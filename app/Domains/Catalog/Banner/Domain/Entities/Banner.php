<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Domain\Entities;

final class Banner
{
    public function __construct(
        public ?int $id,
        public int $storeId,
        public string $name,
        public string $imageUrl,
        public int $sortOrder,
        public bool $isActive
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->storeId,
            'name' => $this->name,
            'image_url' => $this->imageUrl,
            'sort_order' => $this->sortOrder,
            'is_active' => $this->isActive,
        ];
    }
}
