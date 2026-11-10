<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class PromotionPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'package_name' => ['required', 'string', 'max:120'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'proof_url' => ['required', 'url', 'max:2048'],
            'paid_at' => ['nullable', 'date'],
        ];
    }
}
