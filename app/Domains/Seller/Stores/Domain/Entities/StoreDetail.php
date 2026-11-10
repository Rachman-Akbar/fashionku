<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Domain\Entities;

final class StoreDetail
{
    public function __construct(
        private int $id,
        private int $storeId,
        private ?string $ownerName,
        private ?string $ownerPhone,
        private ?string $description,
        private ?string $shippingPolicy,
        private ?string $returnPolicy,
        private ?string $openDays,
        private ?string $openTime,
        private ?string $closeTime,
        private ?string $whatsappUrl,
        private ?string $instagramUrl,
        private ?string $tiktokUrl,
        private ?string $websiteUrl,
        private ?string $createdAt,
        private ?string $updatedAt
    ) {}

    public function id(): int
    {
        return $this->id;
    }

    public function storeId(): int
    {
        return $this->storeId;
    }

    public function ownerName(): ?string
    {
        return $this->ownerName;
    }

    public function ownerPhone(): ?string
    {
        return $this->ownerPhone;
    }

    public function description(): ?string
    {
        return $this->description;
    }

    public function shippingPolicy(): ?string
    {
        return $this->shippingPolicy;
    }

    public function returnPolicy(): ?string
    {
        return $this->returnPolicy;
    }

    public function openDays(): ?string
    {
        return $this->openDays;
    }

    public function openTime(): ?string
    {
        return $this->openTime;
    }

    public function closeTime(): ?string
    {
        return $this->closeTime;
    }

    public function whatsappUrl(): ?string
    {
        return $this->whatsappUrl;
    }

    public function instagramUrl(): ?string
    {
        return $this->instagramUrl;
    }

    public function tiktokUrl(): ?string
    {
        return $this->tiktokUrl;
    }

    public function websiteUrl(): ?string
    {
        return $this->websiteUrl;
    }

    public function createdAt(): ?string
    {
        return $this->createdAt;
    }

    public function updatedAt(): ?string
    {
        return $this->updatedAt;
    }
}
