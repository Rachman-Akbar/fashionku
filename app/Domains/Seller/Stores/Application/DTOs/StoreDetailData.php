<?php

namespace App\Domains\Seller\Stores\Application\DTOs;

use App\Domains\Seller\Stores\Domain\Entities\StoreDetail;

final class StoreDetailData
{
    public function __construct(
        public int $id,
        public int $storeId,
        public ?string $ownerName,
        public ?string $ownerPhone,
        public ?string $description,
        public ?string $shippingPolicy,
        public ?string $returnPolicy,
        public ?string $openDays,
        public ?string $openTime,
        public ?string $closeTime,
        public ?string $whatsappUrl,
        public ?string $instagramUrl,
        public ?string $tiktokUrl,
        public ?string $websiteUrl,
        public ?string $createdAt,
        public ?string $updatedAt,
    ) {}

    public static function fromEntity(StoreDetail $entity): self
    {
        return new self(
            id: $entity->id(),
            storeId: $entity->storeId(),
            ownerName: $entity->ownerName(),
            ownerPhone: $entity->ownerPhone(),
            description: $entity->description(),
            shippingPolicy: $entity->shippingPolicy(),
            returnPolicy: $entity->returnPolicy(),
            openDays: $entity->openDays(),
            openTime: $entity->openTime(),
            closeTime: $entity->closeTime(),
            whatsappUrl: $entity->whatsappUrl(),
            instagramUrl: $entity->instagramUrl(),
            tiktokUrl: $entity->tiktokUrl(),
            websiteUrl: $entity->websiteUrl(),
            createdAt: $entity->createdAt(),
            updatedAt: $entity->updatedAt(),
        );
    }
}
