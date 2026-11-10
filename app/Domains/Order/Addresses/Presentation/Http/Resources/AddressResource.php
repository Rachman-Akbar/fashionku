<?php

namespace App\Domains\Order\Addresses\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'store_id' => $this->store_id,
            'label' => $this->label,
            'recipient_name' => $this->recipient_name,
            'phone_number' => $this->phone_number,
            'country' => $this->country,
            'province' => $this->province,
            'city_or_regency' => $this->city_or_regency,
            'district' => $this->district,
            'subdistrict' => $this->subdistrict,
            'full_address' => $this->full_address,
            'postal_code' => $this->postal_code,
            'notes' => $this->notes,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'komerce_destination_id' => $this->komerce_destination_id,
            'is_primary' => $this->is_primary,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
