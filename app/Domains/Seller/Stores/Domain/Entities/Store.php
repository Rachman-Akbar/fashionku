<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Domain\Entities;

final class Store
{
    public function __construct(
        private int $id,
        private string $userId,
        private string $name,
        private string $slug,
        private ?string $description,
        private ?string $shortDescription,
        private ?string $phone,
        private ?string $email,
        private ?string $city,
        private ?string $province,
        private ?string $address,
        private string $status,
        private bool $isActive,
        private ?string $logo,
        private ?string $bannerUrl,
        private ?string $createdAt,
        private ?string $updatedAt,
        private ?StoreDetail $detail = null,
        private ?string $ownerName = null,
        private ?string $ownerEmail = null,
        private string $storeType = 'regular'
    ) {}

    public function id(): int
    {
        return $this->id;
    }

    public function userId(): string
    {
        return $this->userId;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function slug(): string
    {
        return $this->slug;
    }

    public function description(): ?string
    {
        return $this->description;
    }

    public function shortDescription(): ?string
    {
        return $this->shortDescription;
    }

    public function phone(): ?string
    {
        return $this->phone;
    }

    public function email(): ?string
    {
        return $this->email;
    }

    public function city(): ?string
    {
        return $this->city;
    }

    public function province(): ?string
    {
        return $this->province;
    }

    public function address(): ?string
    {
        return $this->address;
    }

    public function status(): string
    {
        return $this->status;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function isPubliclyAvailable(): bool
    {
        return in_array($this->status, ['approved', 'active'], true) && $this->isActive;
    }

    public function logo(): ?string
    {
        return $this->logo;
    }

    public function bannerUrl(): ?string
    {
        return $this->bannerUrl;
    }

    public function createdAt(): ?string
    {
        return $this->createdAt;
    }

    public function updatedAt(): ?string
    {
        return $this->updatedAt;
    }

    public function detail(): ?StoreDetail
    {
        return $this->detail;
    }

    public function ownerName(): ?string
    {
        return $this->ownerName;
    }

    public function ownerEmail(): ?string
    {
        return $this->ownerEmail;
    }

    public function storeType(): string
    {
        return $this->storeType;
    }

    public function updateDetails(
        string $name,
        string $slug,
        ?string $description,
        ?string $shortDescription,
        ?string $phone,
        ?string $email,
        ?string $city,
        ?string $province,
        ?string $address,
        ?string $logo,
        ?string $bannerUrl,
        bool $isActive
    ): void {
        $this->name = $name;
        $this->slug = $slug;
        $this->description = $description;
        $this->shortDescription = $shortDescription;
        $this->phone = $phone;
        $this->email = $email;
        $this->city = $city;
        $this->province = $province;
        $this->address = $address;
        $this->logo = $logo;
        $this->bannerUrl = $bannerUrl;
        $this->isActive = $isActive;
    }

    public function changeStatus(string $status): void
    {
        $this->status = $status;

        if ($status === 'suspended') {
            $this->isActive = false;
        }
    }
}
