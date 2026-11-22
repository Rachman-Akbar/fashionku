<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Application\Excel;

use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class RawMaterialTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'raw-material';
    }

    public function getHeadings(): array
    {
        return [
            'kode_bahan',
            'image',
            'nama',
            'satuan',
            'stok_awal',
            'biaya_satuan',
            'stok_minimum',
            'aktif',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            [
                'BM-001',
                '',
                'Katun Premium',
                'meter',
                100,
                50000,
                10,
                'ya',
            ],
            [
                'BM-002',
                '',
                'Benang Jahit Polos',
                'rol',
                500,
                15000,
                20,
                'ya',
            ],
            [
                'BM-003',
                '',
                'Kancing Plastik',
                'pack',
                1000,
                5000,
                50,
                'ya',
            ],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['kode_bahan', 'Wajib', 'Kode Unik', 'Kode unik bahan baku. Contoh: BM-001. Harus unik per toko.'],
            ['image', 'Opsional', 'Gambar', 'Gambar bahan baku disematkan di dalam sel ini. Kosongkan jika tidak ada gambar.'],
            ['nama', 'Wajib', 'Teks', 'Nama bahan baku. Contoh: Katun Premium.'],
            ['satuan', 'Wajib', 'Teks', 'Satuan bahan baku. Contoh: meter, rol, pack, kg, pcs.'],
            ['stok_awal', 'Opsional', 'Angka', 'Stok awal bahan baku. Default: 0.'],
            ['biaya_satuan', 'Opsional', 'Angka', 'Biaya per satuan (HPP rata-rata). Contoh: 50000.'],
            ['stok_minimum', 'Opsional', 'Angka', 'Stok minimum untuk peringatan restock. Default: 0.'],
            ['aktif', 'Opsional', 'ya/tidak', 'Status aktif bahan baku. Default: ya.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return 1;
    }

    public function getExampleImagePath(): ?string
    {
        $path = public_path('images/placeholder-rawmaterial.png');
        return file_exists($path) ? $path : null;
    }
}
