<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Domain\ValueObjects;

final class ResolvedDestination
{
    public function __construct(
        public readonly string $id,
        public readonly string $label,
        public readonly string $province,
        public readonly string $cityOrRegency,
        public readonly string $district,
        public readonly string $subdistrict,
        public readonly string $postalCode
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'province' => $this->province,
            'city_or_regency' => $this->cityOrRegency,
            'district' => $this->district,
            'subdistrict' => $this->subdistrict,
            'postal_code' => $this->postalCode,
        ];
    }
}
