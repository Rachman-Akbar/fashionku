<?php

declare(strict_types=1);

namespace App\Domains\Catalog\CatalogGroup\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class CatalogGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];

        if ($this->has('isActive')) {
            $data['is_active'] = $this->boolean('isActive');
        }

        if ($this->has('is_active')) {
            $data['is_active'] = $this->boolean('is_active');
        }

        if ($this->has('name')) {
            $data['name'] = trim((string) preg_replace('/\s+/u', ' ', (string) $this->input('name')));
        }

        if ($this->has('slug')) {
            $slug = trim((string) $this->input('slug'));
            $data['slug'] = $slug !== '' ? Str::slug($slug) : null;
        } elseif ($this->has('name')) {
            $data['slug'] = Str::slug((string) $data['name']);
        }

        $this->merge($data);
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name' => [
                $this->isMethod('post') ? 'required' : 'sometimes',
                'string',
                'max:255',
                Rule::unique('catalog_groups', 'name')->ignore($id),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('catalog_groups', 'slug')->ignore($id),
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
