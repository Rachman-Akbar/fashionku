<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:100'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'city_or_regency' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'subdistrict' => ['required', 'string', 'max:100'],
            'full_address' => ['required', 'string'],
            'postal_code' => ['required', 'string', 'max:20'],
            'is_primary' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ];
    }
}
