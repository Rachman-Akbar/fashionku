<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Excel;

use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;

class CategoryTemplateExport extends BaseTemplateExport
{
    public function getSheetName(): string
    {
        return 'template';
    }

    public function getHeadings(): array
    {
        return [
            'kategori_level_1',
            'kategori_level_2',
            'kategori_level_3',
            'image_url',
            'icon_url',
            'sort_order',
            'aktif',
            'visible_in_menu',
        ];
    }

    public function getExampleRows(): array
    {
        return [
            ['pakaian', '', '', '', '', 1, 'ya', 'ya'],
            ['pakaian', 'atasan', '', '', '', 1, 'ya', 'ya'],
            ['pakaian', 'atasan', 'kaos', '', '', 1, 'ya', 'ya'],
            ['pakaian', 'bawahan', 'celana', '', '', 2, 'ya', 'ya'],
            ['elektronik', 'audio', 'headphone', '', '', 1, 'ya', 'ya'],
        ];
    }

    public function getColumnDescriptions(): array
    {
        return [
            ['kategori_level_1', 'Wajib', 'Teks (lowercase)', 'Nama kategori induk (parent_id = null). Wajib diisi dan otomatis diproses strtolower(trim()).'],
            ['kategori_level_2', 'Opsional', 'Teks (lowercase)', 'Sub-kategori. Parent selalu kategori_level_1 dari baris yang sama sehingga nama sama pada induk berbeda tidak salah induk.'],
            ['kategori_level_3', 'Opsional', 'Teks (lowercase)', 'Kategori child. Hanya boleh diisi jika kategori_level_2 terisi. Maksimal 3 level.'],
            ['image_url', 'Opsional', 'Gambar', 'Gambar disematkan di dalam sel. Hanya diterapkan pada level 3 sesuai aturan media kategori.'],
            ['icon_url', 'Opsional', 'Gambar', 'Icon disematkan di dalam sel. Hanya diterapkan pada level 3.'],
            ['sort_order', 'Opsional', 'Angka', 'Urutan tampil. Default: 0.'],
            ['aktif', 'Opsional', 'ya/tidak', 'Status aktif. Default: ya.'],
            ['visible_in_menu', 'Opsional', 'ya/tidak', 'Tampilkan di menu. Default: ya.'],
        ];
    }

    public function getImageColumnIndex(): int
    {
        return 3;
    }

    public function getExampleImagePath(): ?string
    {
        $path = public_path('images/placeholder-category.png');

        return file_exists($path) ? $path : null;
    }
}
