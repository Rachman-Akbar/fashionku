<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class PromotionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('name')) {
            $data['name'] = trim((string) preg_replace('/\s+/u', ' ', (string) $this->input('name')));
        }

        if ($this->has('is_active')) {
            $data['is_active'] = $this->boolean('is_active');
        }

        $this->merge($data);
    }

    public function rules(): array
    {
        return [
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'promotion_payment_id' => ['nullable', 'integer', 'exists:promotion_payments,id'],
            'name' => ['required', 'string', 'max:150'],
            'image_url' => ['required', 'url', 'max:2048'],
            'mobile_image_url' => ['nullable', 'url', 'max:2048'],
            'click_action' => ['required', Rule::in(['none', 'product', 'category', 'url'])],
            'target_id' => ['nullable', 'integer'],
            'target_url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
