<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\DTOs;

use App\Domains\Seller\Stores\Domain\Entities\Store;

final class StoreData
{
    public function __construct(
        public int $id,
        public string $userId,
        public string $name,
        public string $slug,
        public ?string $description,
        public ?string $shortDescription,
        public ?string $phone,
        public ?string $email,
        public ?string $city,
        public ?string $province,
        public ?string $address,
        public string $status,
        public bool $isActive,
        public ?string $logo,
        public ?string $bannerUrl,
        public ?string $createdAt,
        public ?string $updatedAt,
        public ?StoreDetailData $detail = null,
        public ?string $ownerName = null,
        public ?string $ownerEmail = null,
        public string $storeType = 'regular',
    ) {}

    public static function fromEntity(Store $entity): self
    {
        return new self(
            id: $entity->id(),
            userId: $entity->userId(),
            name: $entity->name(),
            slug: $entity->slug(),
            description: $entity->description(),
            shortDescription: $entity->shortDescription(),
            phone: $entity->phone(),
            email: $entity->email(),
            city: $entity->city(),
            province: $entity->province(),
            address: $entity->address(),
            status: $entity->status(),
            isActive: $entity->isActive(),
            logo: $entity->logo(),
            bannerUrl: $entity->bannerUrl(),
            createdAt: $entity->createdAt(),
            updatedAt: $entity->updatedAt(),
            detail: $entity->detail() ? StoreDetailData::fromEntity($entity->detail()) : null,
            ownerName: $entity->ownerName(),
            ownerEmail: $entity->ownerEmail(),
            storeType: $entity->storeType(),
        );
    }
}
