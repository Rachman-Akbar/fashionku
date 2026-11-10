<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Application\DTOs;

final readonly class RegisterSellerDTO
{
    public function __construct(
        public string $storeName,
        public string $slug,
        public ?string $description = null,
        public ?string $shortDescription = null,
        public ?string $phone = null,
        public ?string $email = null,
        public ?string $city = null,
        public ?string $province = null,
        public ?string $address = null,
        public ?string $logo = null,
        public ?string $bannerUrl = null,
        public array $detail = []
    ) {}
}
