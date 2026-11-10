<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class StoreVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => $this->has('code') ? Str::lower(trim((string) $this->input('code'))) : $this->input('code'),
            'name' => $this->has('name') ? trim((string) preg_replace('/\s+/u', ' ', (string) $this->input('name'))) : $this->input('name'),
        ]);
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            'discount_target' => ['required', Rule::in(['product', 'shipping'])],
            'discount_type' => ['required', Rule::in(['fixed', 'percentage'])],
            'discount_value' => ['required', 'numeric', 'min:0.01'],
            'min_spend' => ['required', 'numeric', 'min:0'],
            'min_items' => ['nullable', 'integer', 'min:0'],
            'min_distinct_products' => ['nullable', 'integer', 'min:1'],
            'terms' => ['nullable', 'string', 'max:500'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'starts_at' => ['required', 'date_format:Y-m-d H:i:s'],
            'ends_at' => ['required', 'date_format:Y-m-d H:i:s', 'after:starts_at'],
            'usage_limit' => ['required', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
