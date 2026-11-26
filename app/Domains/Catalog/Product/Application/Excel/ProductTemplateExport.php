<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Excel;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductTemplateExport implements Export, WithMultipleSheets
{
    public const PRODUCT_HEADINGS = [
        'kode_produk',
        'gambar',
        'nama_produk',
        'kategori',
        'kode_sku_varian',
        'atribut_varian',
        'harga',
        'brand',
        'deskripsi',
        'aktif',
    ];

    public const MATERIAL_HEADINGS = ['kode_sku_varian', 'kode_bahan', 'qty_pakai'];

    public function sheets(): array
    {
        return [
            new ProductTemplateArraySheet('template_produk', [self::PRODUCT_HEADINGS], 1),
            new ProductTemplateArraySheet('template_bahan_baku', [self::MATERIAL_HEADINGS], -1),
            new ProductTemplateArraySheet('contoh_produk', $this->productExampleRows(), 1),
            new ProductTemplateArraySheet('contoh_produk_varian', $this->variantExampleRows(), 1),
            new ProductTemplateArraySheet('contoh_produk_hpp', $this->productWithHppExampleRows(), 1),
            new ProductTemplateArraySheet('contoh_produk_varian_hpp', $this->variantWithHppExampleRows(), 1),
            new ProductTemplateArraySheet('penjelasan_kolom', $this->descriptionRows(), -1),
        ];
    }

    /**
     * Contoh 1: produk tanpa varian dan tanpa HPP.
     * atribut_varian dibiarkan kosong = produk terdiri dari satu varian default.
     */
    private function productExampleRows(): array
    {
        return [
            self::PRODUCT_HEADINGS,
            ['PRD-001', '', 'kaos polos premium', 'kaos', 'KAOS-POLOS', '', 150000, 'fashionku', 'Kaos katun premium', 'ya'],
        ];
    }

    /**
     * Contoh 2: satu produk dengan beberapa varian, tanpa HPP.
     * Baris dengan kode_produk sama digabung menjadi varian produk induk.
     */
    private function variantExampleRows(): array
    {
        return [
            self::PRODUCT_HEADINGS,
            ['PRD-002', '', 'kaos polos premium', 'kaos', 'KAOS-L-BLK', 'ukuran:large, warna:hitam', 150000, 'fashionku', 'Kaos katun premium', 'ya'],
            ['PRD-002', '', 'kaos polos premium', 'kaos', 'KAOS-M-BLK', 'ukuran:medium, warna:hitam', 150000, 'fashionku', 'Kaos katun premium', 'ya'],
            ['PRD-002', '', 'kaos polos premium', 'kaos', 'KAOS-L-WHT', 'ukuran:large, warna:putih', 155000, 'fashionku', 'Kaos katun premium', 'ya'],
        ];
    }

    /**
     * Contoh 3: produk tanpa varian, lengkap dengan resep bahan baku (HPP).
     */
    private function productWithHppExampleRows(): array
    {
        return [
            self::PRODUCT_HEADINGS,
            ['PRD-003', '', 'kaos polos premium', 'kaos', 'KAOS-POLOS', '', 150000, 'fashionku', 'Kaos katun premium', 'ya'],
            [],
            self::MATERIAL_HEADINGS,
            ['KAOS-POLOS', 'BHN-001', 0.25],
            ['KAOS-POLOS', 'BHN-002', 0.05],
        ];
    }

    /**
     * Contoh 4: produk dengan beberapa varian, masing-masing punya resep HPP.
     */
    private function variantWithHppExampleRows(): array
    {
        return [
            self::PRODUCT_HEADINGS,
            ['PRD-004', '', 'kaos polos premium', 'kaos', 'KAOS-L-BLK', 'ukuran:large, warna:hitam', 150000, 'fashionku', 'Kaos katun premium', 'ya'],
            ['PRD-004', '', 'kaos polos premium', 'kaos', 'KAOS-M-BLK', 'ukuran:medium, warna:hitam', 150000, 'fashionku', 'Kaos katun premium', 'ya'],
            ['PRD-004', '', 'kaos polos premium', 'kaos', 'KAOS-L-WHT', 'ukuran:large, warna:putih', 155000, 'fashionku', 'Kaos katun premium', 'ya'],
            [],
            self::MATERIAL_HEADINGS,
            ['KAOS-L-BLK', 'BHN-001', 0.25],
            ['KAOS-L-BLK', 'BHN-002', 0.05],
            ['KAOS-M-BLK', 'BHN-001', 0.22],
            ['KAOS-L-WHT', 'BHN-001', 0.25],
        ];
    }

    private function descriptionRows(): array
    {
        return [
            ['Nama Kolom', 'Wajib / Opsional', 'Format Data', 'Keterangan & Aturan Relasi'],
            ['kode_produk', 'Wajib', 'Teks', 'Kode pengelompokan produk. Baris dengan kode_produk sama digabung sebagai varian dari satu produk induk.'],
            ['gambar', 'Opsional', 'Gambar dalam sel', 'Thumbnail produk disematkan pada sel ini (bukan URL).'],
            ['nama_produk', 'Wajib', 'Teks', 'Nama produk induk.'],
            ['kategori', 'Wajib', 'Teks (nama daun)', 'Cukup tulis nama kategori (level daun) yang sudah ada. Sistem otomatis mencari path induknya. Cocokkan case-insensitive.'],
            ['kode_sku_varian', 'Wajib', 'Teks unik', 'SKU custom per varian. Boleh diisi kode buatan sendiri; kosongkan untuk dibuat otomatis dari rumus SKU.'],
            ['atribut_varian', 'Opsional', 'atribut:nilai, atribut:nilai', 'Contoh: ukuran:large, gula:normal. Satu atribut hanya boleh sekali per baris. Kosongkan jika produk tidak memiliki varian.'],
            ['harga', 'Opsional', 'Angka', 'Harga jual varian.'],
            ['brand', 'Opsional', 'Teks', 'Merek produk.'],
            ['deskripsi', 'Opsional', 'Teks Panjang', 'Deskripsi produk.'],
            ['aktif', 'Opsional', 'ya/tidak', 'Status aktif produk. Default: ya.'],
            ['— Sheet template_bahan_baku —', '', '', ''],
            ['kode_sku_varian', 'Wajib', 'Teks', 'SKU varian hasil sheet template_produk yang sudah ada.'],
            ['kode_bahan', 'Wajib', 'Teks', 'Kode bahan baku master. Jika tidak ditemukan, baris dibatalkan dengan pesan error.'],
            ['qty_pakai', 'Wajib', 'Angka > 0', 'Jumlah pemakaian bahan per varian. HPP dihitung otomatis: SUM(qty_pakai × harga satuan bahan).'],
            ['— Daftar sheet contoh —', '', '', ''],
            ['contoh_produk', 'Contoh', '1 baris', 'Produk tanpa varian (atribut_varian kosong) dan tanpa HPP.'],
            ['contoh_produk_varian', 'Contoh', 'Beberapa baris', 'Produk dengan varian (atribut_varian terisi, kode_produk sama digabung), tanpa HPP.'],
            ['contoh_produk_hpp', 'Contoh', 'Produk + bahan baku', 'Produk tanpa varian dengan resep bahan baku sehingga HPP dihitung otomatis.'],
            ['contoh_produk_varian_hpp', 'Contoh', 'Produk + varian + bahan baku', 'Produk dengan varian, masing-masing varian memiliki resep bahan baku (HPP per varian).'],
        ];
    }
}

final class ProductTemplateArraySheet implements FromArray, WithColumnWidths, WithDrawings, WithStyles, WithTitle
{
    public function __construct(
        private string $title,
        private array $rows,
        private int $imageColumnIndex = -1,
    ) {}

    public function title(): string
    {
        return $this->title;
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function styles(Worksheet $sheet): array
    {
        $lastColumn = $this->columnLetter(max(0, count($this->rows[0] ?? []) - 1));
        $lastRow = max(1, count($this->rows));

        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        $sheet->getStyle("A2:{$lastColumn}{$lastRow}")->applyFromArray([
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        if ($this->imageColumnIndex >= 0) {
            for ($row = 2; $row <= max(2, $lastRow); $row++) {
                $sheet->getRowDimension($row)->setRowHeight(80);
            }
        }

        $sheet->freezePane('A2');

        return [];
    }

    public function columnWidths(): array
    {
        $widths = [];
        $headings = $this->rows[0] ?? [];

        foreach ($headings as $index => $heading) {
            $widths[$this->columnLetter($index)] = $index === $this->imageColumnIndex
                ? 15
                : min(max(strlen((string) $heading) * 1.5, 15), 50);
        }

        return $widths;
    }

    public function drawings(): array
    {
        if ($this->imageColumnIndex < 0) {
            return [];
        }

        $path = public_path('images/placeholder-product.png');
        if (! file_exists($path)) {
            return [];
        }

        $drawing = new Drawing;
        $drawing->setName('Contoh Gambar');
        $drawing->setDescription('Contoh Gambar');
        $drawing->setPath($path);
        $drawing->setHeight(60);
        $drawing->setWidth(60);
        $drawing->setCoordinates($this->columnLetter($this->imageColumnIndex).'2');
        $drawing->setOffsetX(5);
        $drawing->setOffsetY(5);

        return [$drawing];
    }

    private function columnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr(65 + ($index % 26)).$letter;
            $index = intdiv($index, 26) - 1;
        }

        return $letter;
    }
}
