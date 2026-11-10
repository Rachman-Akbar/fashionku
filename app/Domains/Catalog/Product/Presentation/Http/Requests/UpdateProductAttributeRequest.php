<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class UpdateProductAttributeRequest extends FormRequest
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
        $id = (int) $this->route('id');

        return [
            'name' => ['nullable', 'string', 'max:255', Rule::unique('product_attributes', 'name')->ignore($id)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('product_attributes', 'slug')->ignore($id)],
            'type' => ['nullable', 'string', 'max:50', Rule::in(['select', 'text', 'number', 'color'])],
        ];
    }
}
