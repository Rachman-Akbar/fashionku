<?php

declare(strict_types=1);

namespace App\Domains\Shared\Excel\Application\Templates;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

abstract class BaseTemplateExport implements WithMultipleSheets, FromArray, Export
{
    /**
     * Penanda `Export` untuk Excel::download(). Dengan WithMultipleSheets,
     * daftar sheet diambil dari sheets(), jadi isi array() tidak dipakai.
     */
    public function array(): array
    {
        return [];
    }

    abstract public function getSheetName(): string;
    abstract public function getHeadings(): array;
    abstract public function getExampleRows(): array;
    abstract public function getColumnDescriptions(): array;
    abstract public function getImageColumnIndex(): int;
    abstract public function getExampleImagePath(): ?string;

    public function sheets(): array
    {
        $sheets = [
            new TemplateSheet($this),
            new ExampleSheet($this),
            new DescriptionSheet($this),
        ];

        return $sheets;
    }
}

class TemplateSheet implements FromArray, WithTitle, WithStyles, WithColumnWidths, WithDrawings
{
    private BaseTemplateExport $parent;

    public function __construct(BaseTemplateExport $parent)
    {
        $this->parent = $parent;
    }

    public function title(): string
    {
        return 'template';
    }

    public function array(): array
    {
        return [$this->parent->getHeadings()];
    }

    public function styles(Worksheet $sheet): array
    {
        $columnCount = count($this->parent->getHeadings());
        $lastColumn = $this->getColumnLetter($columnCount - 1);

        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        $sheet->getStyle("A2:{$lastColumn}100")->applyFromArray([
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        $imageColumn = $this->parent->getImageColumnIndex();
        if ($imageColumn !== -1) {
            $columnLetter = $this->getColumnLetter($imageColumn);
            for ($row = 2; $row <= 100; $row++) {
                $sheet->getRowDimension($row)->setRowHeight(80);
            }
        }

        $sheet->freezePane('A2');

        return [];
    }

    public function columnWidths(): array
    {
        $headings = $this->parent->getHeadings();
        $widths = [];

        foreach ($headings as $index => $heading) {
            $width = max(strlen($heading) * 1.5, 15);
            if ($index === $this->parent->getImageColumnIndex()) {
                $width = 15;
            }
            $widths[$this->getColumnLetter($index)] = min($width, 50);
        }

        return $widths;
    }

    public function drawings(): array
    {
        $imagePath = $this->parent->getExampleImagePath();
        $imageColumn = $this->parent->getImageColumnIndex();

        if (! $imagePath || $imageColumn === -1 || ! file_exists($imagePath)) {
            return [];
        }

        $drawing = new Drawing();
        $drawing->setName('Example_Image');
        $drawing->setDescription('Contoh Gambar');
        $drawing->setPath($imagePath);
        $drawing->setHeight(60);
        $drawing->setWidth(60);
        $drawing->setCoordinates($this->getColumnLetter($imageColumn) . '2');
        $drawing->setOffsetX(5);
        $drawing->setOffsetY(5);

        return [$drawing];
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

class ExampleSheet implements FromArray, WithTitle, WithStyles, WithColumnWidths, WithDrawings
{
    private BaseTemplateExport $parent;

    public function __construct(BaseTemplateExport $parent)
    {
        $this->parent = $parent;
    }

    public function title(): string
    {
        return 'contoh import';
    }

    public function array(): array
    {
        $rows = [$this->parent->getHeadings()];
        $exampleRows = $this->parent->getExampleRows();

        foreach ($exampleRows as $row) {
            $rows[] = $row;
        }

        return $rows;
    }

    public function styles(Worksheet $sheet): array
    {
        $columnCount = count($this->parent->getHeadings());
        $lastColumn = $this->getColumnLetter($columnCount - 1);
        $rowCount = count($this->parent->getExampleRows()) + 1;

        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        $sheet->getStyle("A2:{$lastColumn}{$rowCount}")->applyFromArray([
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        $imageColumn = $this->parent->getImageColumnIndex();
        if ($imageColumn !== -1) {
            $columnLetter = $this->getColumnLetter($imageColumn);
            for ($row = 2; $row <= $rowCount; $row++) {
                $sheet->getRowDimension($row)->setRowHeight(80);
            }
        }

        $sheet->freezePane('A2');

        return [];
    }

    public function columnWidths(): array
    {
        $headings = $this->parent->getHeadings();
        $widths = [];

        foreach ($headings as $index => $heading) {
            $width = max(strlen($heading) * 1.5, 15);
            if ($index === $this->parent->getImageColumnIndex()) {
                $width = 15;
            }
            $widths[$this->getColumnLetter($index)] = min($width, 50);
        }

        return $widths;
    }

    public function drawings(): array
    {
        $imagePath = $this->parent->getExampleImagePath();
        $imageColumn = $this->parent->getImageColumnIndex();
        $exampleRows = $this->parent->getExampleRows();

        if (! $imagePath || $imageColumn === -1 || ! file_exists($imagePath) || empty($exampleRows)) {
            return [];
        }

        $drawings = [];
        foreach ($exampleRows as $index => $row) {
            $drawing = new Drawing();
            $drawing->setName('Example_Image_' . ($index + 1));
            $drawing->setDescription('Contoh Gambar ' . ($index + 1));
            $drawing->setPath($imagePath);
            $drawing->setHeight(60);
            $drawing->setWidth(60);
            $drawing->setCoordinates($this->getColumnLetter($imageColumn) . ($index + 2));
            $drawing->setOffsetX(5);
            $drawing->setOffsetY(5);

            $drawings[] = $drawing;
        }

        return $drawings;
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

class DescriptionSheet implements FromArray, WithTitle, WithStyles
{
    private BaseTemplateExport $parent;

    public function __construct(BaseTemplateExport $parent)
    {
        $this->parent = $parent;
    }

    public function title(): string
    {
        return 'penjelasan kolom';
    }

    public function array(): array
    {
        $rows = [
            ['Nama Kolom', 'Wajib / Opsional', 'Format Data', 'Keterangan & Aturan Relasi'],
        ];

        $descriptions = $this->parent->getColumnDescriptions();
        foreach ($descriptions as $desc) {
            $rows[] = [
                $desc['column'] ?? '',
                $desc['required'] ?? 'Opsional',
                $desc['format'] ?? 'Teks',
                $desc['description'] ?? '',
            ];
        }

        return $rows;
    }

    public function styles(Worksheet $sheet): array
    {
        $columnCount = 4;
        $lastColumn = $this->getColumnLetter($columnCount - 1);
        $rowCount = count($this->parent->getColumnDescriptions()) + 1;

        $sheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 12],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F172A']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        $sheet->getStyle("A2:{$lastColumn}{$rowCount}")->applyFromArray([
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E2E8F0']]],
        ]);

        for ($col = 0; $col < $columnCount; $col++) {
            $sheet->getColumnDimension($this->getColumnLetter($col))->setWidth(30);
        }

        $sheet->freezePane('A2');

        return [];
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