<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Application\Excel;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class StockExport extends BaseExport
{
    public function __construct(protected ?Collection $stocks = null) {}

    public function collection(): Collection
    {
        return $this->stocks ?? ProductVariantModel::with('product')->get();
    }

    public function headings(): array
    {
        return [
            'sku',
            'nama_produk',
            'nama_varian',
            'stok_tersedia',
            'stok_reserved',
            'stok_booked',
            'stok_preorder',
            'stok_minimum',
            'alasan_penyesuaian',
        ];
    }

    public function map($variant): array
    {
        return [
            $variant->sku ?? '',
            $variant->product?->name ?? '',
            $variant->name ?? '',
            $variant->stock ?? 0,
            $variant->reserved_stock ?? 0,
            $variant->booked_stock ?? 0,
            $variant->preorder_stock ?? 0,
            $variant->min_stock ?? 0,
            '',
        ];
    }
}
