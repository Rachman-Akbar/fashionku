<?php

declare(strict_types=1);

namespace App\Domains\Shared\Excel\Application\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ErrorExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    public function __construct(
        private array $errors,
        private string $moduleLabel
    ) {}

    public function collection(): Collection
    {
        $rows = [];

        foreach ($this->errors as $error) {
            $row = [
                'baris' => $error['row'] ?? 0,
            ];

            if (isset($error['data'])) {
                foreach ($error['data'] as $key => $value) {
                    $row[$key] = $value;
                }
            }

            if (isset($error['attribute'])) {
                $row['field'] = $error['attribute'];
            }

            if (isset($error['errors'])) {
                $row['detail'] = is_array($error['errors']) ? implode('; ', $error['errors']) : $error['errors'];
            }

            // Kolom error ditaruh paling kanan supaya mudah dicek tanpa harus
            // mencari-cari di antara kolom data.
            $row['error'] = $error['error'] ?? '';

            $rows[] = $row;
        }

        return collect($rows);
    }

    public function headings(): array
    {
        $headings = ['baris'];

        if (! empty($this->errors) && isset($this->errors[0]['data'])) {
            $headings = array_merge($headings, array_keys($this->errors[0]['data']));
        }

        if (! empty($this->errors) && (isset($this->errors[0]['attribute']) || isset($this->errors[0]['errors']))) {
            $headings = array_merge($headings, ['field', 'detail']);
        }

        // Selalu chiwarnakan "error" sebagai kolom terakhir (paling kanan).
        $headings[] = 'error';

        return $headings;
    }

    public function styles(Worksheet $sheet): array
    {
        $highestColumn = $sheet->getHighestColumn();
        $highestRow = $sheet->getHighestRow();

        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'DC2626']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
            ],
            "A2:{$highestColumn}{$highestRow}" => [
                'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
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
            $widths[$this->getColumnLetter($index)] = min($width, 60);
        }

        return $widths;
    }

    private function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr(65 + ($index % 26)) . $letter;
            $index = intdiv($index, 26) - 1;
        }
        return $letter;
    }
}