<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class BannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge(['name' => trim((string) preg_replace('/\s+/u', ' ', (string) $this->input('name')))]);
        }
    }

    public function rules(): array
    {
        return [
            'store_id' => ['sometimes', 'integer', 'exists:stores,id'],
            'name' => ['required', 'string', 'max:150'],
            'image_url' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
