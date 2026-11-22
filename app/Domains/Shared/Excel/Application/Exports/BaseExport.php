<?php

declare(strict_types=1);

namespace App\Domains\Shared\Excel\Application\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

abstract class BaseExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithDrawings
{
    protected int $rowHeight = 80;
    protected int $imageColumnIndex = 0;
    protected string $imagePathColumn = '';
    protected int $imageWidth = 60;
    protected int $imageHeight = 60;

    abstract public function collection(): Collection;
    abstract public function headings(): array;
    abstract public function map($row): array;

    public function drawings(): array
    {
        $drawings = [];
        $rows = $this->collection();

        foreach ($rows as $rowIndex => $row) {
            $imagePath = $this->getImagePath($row);
            if (! $imagePath || ! file_exists(storage_path('app/public/' . $imagePath))) {
                continue;
            }

            $drawing = new Drawing();
            $drawing->setName('Image_' . ($rowIndex + 1));
            $drawing->setDescription('Image');
            $drawing->setPath(storage_path('app/public/' . $imagePath));
            $drawing->setHeight($this->imageHeight);
            $drawing->setWidth($this->imageWidth);
            $drawing->setCoordinates($this->getColumnLetter($this->imageColumnIndex) . ($rowIndex + 2));
            $drawing->setOffsetX(5);
            $drawing->setOffsetY(5);
            $drawing->setWorksheet(null);

            $drawings[] = $drawing;
        }

        return $drawings;
    }

    public function styles(Worksheet $sheet): array
    {
        $highestColumn = $sheet->getHighestColumn();
        $highestRow = $sheet->getHighestRow();

        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ],
            // Rentang harus dibatasi ke kolom yang dipakai. `"2:{$highestRow}"`
            // berarti seluruh baris (sampai kolom XFD / 16.384 kolom), sehingga
            // PhpSpreadsheet membuat ratusan ribu sel kosong → export lambat dan
            // menghabiskan memori (export besar gagal dengan "Allowed memory
            // size exhausted").
            "A2:{$highestColumn}{$highestRow}" => [
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ],
            "A1:{$highestColumn}{$highestRow}" => [
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ],
        ];
    }

    public function columnWidths(): array
    {
        $headings = $this->headings();
        $widths = [];

        foreach ($headings as $index => $heading) {
            $width = max(strlen($heading) * 1.5, 15);
            if ($index === $this->imageColumnIndex) {
                $width = 15;
            }
            $widths[$this->getColumnLetter($index)] = min($width, 50);
        }

        return $widths;
    }

    protected function getImagePath($row): ?string
    {
        if (! $this->imagePathColumn) {
            return null;
        }

        if (is_array($row)) {
            return $row[$this->imagePathColumn] ?? null;
        }

        return $row->{$this->imagePathColumn} ?? null;
    }

    protected function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr(65 + ($index % 26)) . $letter;
            $index = intdiv($index, 26) - 1;
        }
        return $letter;
    }

    protected function sanitizeValue(mixed $value): mixed
    {
        if (is_string($value)) {
            return strtolower(trim($value));
        }
        return $value;
    }
}