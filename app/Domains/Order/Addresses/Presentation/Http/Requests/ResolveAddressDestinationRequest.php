<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ResolveAddressDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'country' => ['nullable', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'city_or_regency' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'subdistrict' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
        ];
    }
}
