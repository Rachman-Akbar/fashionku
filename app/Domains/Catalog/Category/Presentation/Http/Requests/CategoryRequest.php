<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Presentation\Http\Requests;

use App\Domains\Catalog\Category\Application\Dtos\CategoryData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

final class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $normalized = [];

        if ($this->has('name')) {
            $normalized['name'] = trim((string) preg_replace('/\s+/u', ' ', (string) $this->input('name')));
        }

        if ($this->has('slug')) {
            $slug = trim((string) $this->input('slug'));
            $normalized['slug'] = $slug === '' ? null : Str::slug($slug);
        }

        foreach (['is_active', 'is_visible_in_menu'] as $field) {
            if ($this->has($field)) {
                $normalized[$field] = $this->boolean($field);
            }
        }

        $this->merge($normalized);
    }

    public function rules(): array
    {
        $categoryId = $this->categoryId();
        $isCreate = $this->isMethod('post');

        return [
            'catalog_group_id' => $isCreate
                ? ['required_without:parent_id', 'nullable', 'integer', 'exists:catalog_groups,id']
                : ['sometimes', 'integer', 'exists:catalog_groups,id'],
            'parent_id' => array_values(array_filter([
                $isCreate ? 'nullable' : 'sometimes',
                'nullable',
                'integer',
                'exists:categories,id',
                $categoryId ? Rule::notIn([$categoryId]) : null,
            ])),
            'name' => $isCreate
                ? ['required', 'string', 'max:255']
                : ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255'],
            'image_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'icon_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_visible_in_menu' => ['sometimes', 'boolean'],
        ];
    }

    public function toData(): CategoryData
    {
        return CategoryData::fromArray($this->validated());
    }

    private function categoryId(): ?int
    {
        $routeValue = $this->route('category') ?? $this->route('id');

        if (is_object($routeValue) && method_exists($routeValue, 'getKey')) {
            return (int) $routeValue->getKey();
        }

        if ($routeValue === null || $routeValue === '') {
            return null;
        }

        return (int) $routeValue;
    }
}
