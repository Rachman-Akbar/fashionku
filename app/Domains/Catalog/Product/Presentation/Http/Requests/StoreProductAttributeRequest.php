<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class StoreProductAttributeRequest extends FormRequest
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

        if ($this->has('slug')) {
            $data['slug'] = Str::slug((string) $this->input('slug'));
        } elseif ($this->has('name')) {
            $data['slug'] = Str::slug((string) $data['name']);
        }

        $this->merge($data);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:product_attributes,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:product_attributes,slug'],
            'type' => ['nullable', 'string', 'max:50', Rule::in(['select', 'text', 'number', 'color'])],
        ];
    }
}
