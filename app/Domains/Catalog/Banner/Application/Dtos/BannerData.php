<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Application\Dtos;

final class BannerData
{
    public function __construct(
        public ?int $id,
        public int $storeId,
        public string $name,
        public string $imageUrl,
        public int $sortOrder,
        public bool $isActive
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            storeId: (int) ($data['store_id'] ?? 27),
            name: trim((string) preg_replace('/\s+/u', ' ', (string) ($data['name'] ?? 'banner'))),
            imageUrl: (string) $data['image_url'],
            sortOrder: (int) ($data['sort_order'] ?? 0),
            isActive: (bool) ($data['is_active'] ?? true)
        );
    }

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
