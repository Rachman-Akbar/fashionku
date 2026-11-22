<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Application\Excel;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class StockImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = ProductVariantModel::class;
    protected string $uniqueKey = 'sku';

    protected array $relationMappings = [
        'sku' => [
            'model' => ProductVariantModel::class,
            'search_column' => 'sku',
            'target_column' => 'id',
            'target_key' => 'id',
            'create_missing' => false,
        ],
    ];

    public function model(): string
    {
        return ProductVariantModel::class;
    }

    public function uniqueKey(): string
    {
        return 'sku';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'sku';
    }

    public function rules(): array
    {
        return [
            'sku' => 'required|string|max:100|exists:product_variants,sku',
            'stok_tersedia' => 'required|numeric|min:0',
            'stok_reserved' => 'nullable|numeric|min:0',
            'stok_booked' => 'nullable|numeric|min:0',
            'stok_preorder' => 'nullable|numeric|min:0',
            'stok_minimum' => 'nullable|numeric|min:0',
            'alasan_penyesuaian' => 'nullable|string',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['sku'])) {
            $errors['sku'] = 'SKU varian wajib diisi';
        }

        if (! isset($row['stok_tersedia']) || $row['stok_tersedia'] === '') {
            $errors['stok_tersedia'] = 'Stok tersedia wajib diisi';
        }

        return $errors;
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        if (! $existing) {
            throw new \InvalidArgumentException('SKU tidak ditemukan: ' . ($data['sku'] ?? 'unknown'));
        }

        return [
            'stock' => (int) ($data['stok_tersedia'] ?? 0),
            'reserved_stock' => (int) ($data['stok_reserved'] ?? 0),
            'booked_stock' => (int) ($data['stok_booked'] ?? 0),
            'preorder_stock' => (int) ($data['stok_preorder'] ?? 0),
            'min_stock' => (int) ($data['stok_minimum'] ?? 0),
            'updated_by' => auth()->id(),
        ];
    }
}
