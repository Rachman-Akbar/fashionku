<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StockAdjustmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'quantity_delta' => ['required', 'integer', 'not_in:0'],
            'movement_type' => ['nullable', 'in:inbound,outbound,adjustment,release,reservation,production'],
            'reference_type' => ['nullable', 'string', 'max:80'],
            'reference_id' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'occurred_at' => ['nullable', 'date'],
        ];
    }
}
