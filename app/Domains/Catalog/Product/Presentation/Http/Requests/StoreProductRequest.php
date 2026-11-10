<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class StoreProductRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $payload = [];
        $user = $this->user();

        if (! $this->input('store_id') && $user) {
            $storeId = DB::table('stores')->where('user_id', $user->id)->value('id');

            if ($storeId) {
                $payload['store_id'] = (int) $storeId;
            }
        }

        if ($this->has('name')) {
            $payload['name'] = trim((string) preg_replace('/\s+/u', ' ', (string) $this->input('name')));
        }

        if (is_array($this->input('variants'))) {
            $payload['variants'] = collect($this->input('variants'))
                ->map(function (array $variant): array {
                    if (array_key_exists('name', $variant)) {
                        $variant['name'] = trim((string) preg_replace('/\s+/u', ' ', (string) $variant['name']));
                    }

                    return $variant;
                })
                ->all();
        }

        if ($payload !== []) {
            $this->merge($payload);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $storeId = $this->input('store_id');

        return [
            'store_id' => ['required', 'integer', 'exists:stores,id'],
            'primary_category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('product_variants', 'sku')->where(fn ($query) => $query->where('store_id', $storeId)),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'name')->where(fn ($query) => $query->where('store_id', $storeId)),
            ],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'brand' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'status' => ['nullable', 'string', Rule::in(['draft', 'published', 'archived'])],
            'is_active' => ['nullable', 'boolean'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'distinct', 'exists:categories,id'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_original' => ['nullable', 'numeric', 'min:0'],
            'price_sale' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'po_stock' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*.url' => ['required_with:images', 'string', 'max:2048'],
            'images.*.alt_text' => ['nullable', 'string', 'max:255'],
            'images.*.is_primary' => ['nullable', 'boolean'],
            'images.*.sort_order' => ['nullable', 'integer'],
            'attribute_values' => ['nullable', 'array'],
            'attribute_values.*.attribute_id' => ['required_with:attribute_values', 'integer', 'exists:product_attributes,id'],
            'attribute_values.*.value' => ['required_with:attribute_values', 'string', 'max:255'],
            'variants' => ['nullable', 'array', 'min:1'],
            'variants.*.sku' => [
                'nullable',
                'string',
                'max:100',
                'distinct',
                Rule::unique('product_variants', 'sku')->where(fn ($query) => $query->where('store_id', $storeId)),
            ],
            'variants.*.name' => ['required_with:variants', 'string', 'max:255', 'distinct'],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.price_original' => ['nullable', 'numeric', 'min:0'],
            'variants.*.price_sale' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.po_stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.min_stock' => ['nullable', 'integer', 'min:0'],
            'variants.*.is_default' => ['nullable', 'boolean'],
            'variants.*.values' => ['nullable', 'array'],
            'variants.*.values.*.attribute_id' => ['required_with:variants.*.values', 'integer', 'exists:product_attributes,id'],
            'variants.*.values.*.value' => ['required_with:variants.*.values', 'string', 'max:255'],
        ];
    }
}
