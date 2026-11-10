<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ProductReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'order_item_id' => [$this->isMethod('post') ? 'required' : 'nullable', 'integer', 'exists:order_items,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'review' => ['nullable', 'string', 'max:5000'],
            'media' => ['nullable', 'array', 'max:5'],
            'media.*' => ['string', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
