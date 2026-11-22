<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Application\Excel;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class StockTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'stock';
    }

    public function getHeadings(): array
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

    public function getExampleRows(): array
    {
        return [
            [
                'PRD-001-M',
                'Kaos Polos Premium',
                'Medium',
                100,
                5,
                3,
                0,
                10,
                'Restock mingguan',
            ],
            [
                'PRD-001-L',
                'Kaos Polos Premium',
                'Large',
                80,
                2,
                1,
                0,
                10,
                'Restock mingguan',
            ],
            [
                'PRD-002-32',
                'Celana Jeans Slimfit',
                '32',
                50,
                0,
                0,
                5,
                5,
                'Penyesuaian stok fisik',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['sku', 'Wajib', 'Kode SKU Varian', 'SKU varian produk yang sudah ada di sistem. Harus persis sama dengan data master. Contoh: PRD-001-M'],
            ['nama_produk', 'Opsional', 'Teks', 'Nama produk (hanya untuk referensi, tidak diproses).'],
            ['nama_varian', 'Opsional', 'Teks', 'Nama varian (hanya untuk referensi, tidak diproses).'],
            ['stok_tersedia', 'Wajib', 'Angka', 'Jumlah stok fisik yang tersedia untuk dijual. Contoh: 100.'],
            ['stok_reserved', 'Opsional', 'Angka', 'Stok yang direservasi (misal untuk order pending). Default: 0.'],
            ['stok_booked', 'Opsional', 'Angka', 'Stok yang dibooking (misal untuk pre-order). Default: 0.'],
            ['stok_preorder', 'Opsional', 'Angka', 'Stok untuk pre-order. Default: 0.'],
            ['stok_minimum', 'Opsional', 'Angka', 'Stok minimum untuk peringatan restock. Default: 0.'],
            ['alasan_penyesuaian', 'Opsional', 'Teks', 'Catatan alasan penyesuaian stok. Contoh: Restock mingguan, Stok opname.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return -1;
    }

    public function getExampleImagePath(): ?string
    {
        return null;
    }
}
