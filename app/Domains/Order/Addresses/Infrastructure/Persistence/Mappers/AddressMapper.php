<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Infrastructure\Persistence\Mappers;

use App\Domains\Order\Addresses\Application\DTOs\AddressDTO;

final class AddressMapper
{
    public static function fromRequestArray(array $data, ?string $userId = null, ?string $storeId = null): AddressDTO
    {
        return new AddressDTO(
            user_id: $userId,
            store_id: $storeId,
            label: $data['label'],
            recipient_name: $data['recipient_name'],
            phone_number: $data['phone_number'],
            country: $data['country'] ?? 'Indonesia',
            province: $data['province'],
            city_or_regency: $data['city_or_regency'],
            district: $data['district'],
            subdistrict: $data['subdistrict'],
            full_address: $data['full_address'],
            postal_code: $data['postal_code'],
            notes: $data['notes'] ?? null,
            is_primary: (bool) ($data['is_primary'] ?? false),
            latitude: (float) $data['latitude'],
            longitude: (float) $data['longitude']
        );
    }

    public static function toEntityArray(AddressDTO $dto): array
    {
        return [
            'user_id' => $dto->user_id,
            'store_id' => $dto->store_id,
            'label' => $dto->label,
            'recipient_name' => $dto->recipient_name,
            'phone_number' => $dto->phone_number,
            'country' => $dto->country,
            'province' => $dto->province,
            'city_or_regency' => $dto->city_or_regency,
            'district' => $dto->district,
            'subdistrict' => $dto->subdistrict,
            'full_address' => $dto->full_address,
            'postal_code' => $dto->postal_code,
            'notes' => $dto->notes,
            'is_primary' => $dto->is_primary,
            'latitude' => $dto->latitude,
            'longitude' => $dto->longitude,
            'komerce_destination_id' => $dto->komerce_destination_id,
        ];
    }
}
