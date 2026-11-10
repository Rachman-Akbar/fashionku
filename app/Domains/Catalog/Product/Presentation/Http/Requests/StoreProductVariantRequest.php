<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

final class StoreProductVariantRequest extends FormRequest
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
        $productId = $this->route('productId');

        $storeId = DB::table('products')->where('id', $productId)->value('store_id');

        return [
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('product_variants', 'sku')->where(fn ($query) => $query->where('store_id', $storeId)),
            ],
            'name' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('product_variants', 'name')->where(fn ($query) => $query->where('product_id', $productId)),
            ],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_original' => ['nullable', 'numeric', 'min:0'],
            'price_sale' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'po_stock' => ['nullable', 'integer', 'min:0'],
            'max_order_qty' => ['nullable', 'integer', 'min:1'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'is_default' => ['nullable', 'boolean'],
            'values' => ['nullable', 'array'],
            'values.*.attribute_id' => ['required_with:values', 'integer', 'exists:product_attributes,id'],
            'values.*.value' => ['required_with:values', 'string', 'max:255'],
        ];
    }
}
