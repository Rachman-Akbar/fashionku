<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Application\DTOs;

final class AddressDTO
{
    public function __construct(
        public ?string $user_id,
        public string $label,
        public string $recipient_name,
        public string $phone_number,
        public string $country,
        public string $province,
        public string $city_or_regency,
        public string $district,
        public string $subdistrict,
        public string $full_address,
        public string $postal_code,
        public ?string $notes,
        public bool $is_primary,
        public float $latitude,
        public float $longitude
    ) {}
}
