<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Application\Excel;

use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class RawMaterialImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = RawMaterialModel::class;
    protected string $uniqueKey = 'kode_bahan';
    protected bool $extractImages = true;
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'image';
    protected string $imageStoragePath = 'raw-materials/imports';

    public function model(): string
    {
        return RawMaterialModel::class;
    }

    public function uniqueKey(): string
    {
        return 'kode_bahan';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'code';
    }

    public function rules(): array
    {
        return [
            'kode_bahan' => 'required|string|max:100|unique:raw_materials,code',
            'nama' => 'required|string|max:255',
            'satuan' => 'required|string|max:50',
            'stok_awal' => 'nullable|numeric|min:0',
            'biaya_satuan' => 'nullable|numeric|min:0',
            'stok_minimum' => 'nullable|numeric|min:0',
            'aktif' => 'nullable|in:ya,tidak,true,false,1,0',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['kode_bahan'])) {
            $errors['kode_bahan'] = 'Kode bahan wajib diisi';
        }

        if (empty($row['nama'])) {
            $errors['nama'] = 'Nama bahan wajib diisi';
        }

        if (empty($row['satuan'])) {
            $errors['satuan'] = 'Satuan wajib diisi';
        }

        return $errors;
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        $payload = parent::preparePayload($data, $existing);

        $payload['code'] = strtolower(trim($data['kode_bahan'] ?? ''));
        $payload['name'] = $data['nama'] ?? '';
        $payload['unit'] = $data['satuan'] ?? '';
        $payload['stock'] = (float) ($data['stok_awal'] ?? 0);
        $payload['average_cost'] = (float) ($data['biaya_satuan'] ?? 0);
        $payload['minimum_stock'] = (float) ($data['stok_minimum'] ?? 0);
        $payload['is_active'] = $this->parseBoolean($data['aktif'] ?? true);

        return $payload;
    }

    protected function parseBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        $value = strtolower(trim((string) $value));
        return in_array($value, ['ya', 'true', '1', 'yes'], true);
    }

    protected function extractAndSaveImage(int $rowNumber, array &$payload): void
    {
        if (! isset($this->spreadsheet)) {
            return;
        }

        $sheet = $this->spreadsheet->getActiveSheet();
        $coordinate = $this->getColumnLetter($this->imageColumnIndex) . ($rowNumber + 1);
        $drawings = $sheet->getDrawingCollection();

        foreach ($drawings as $drawing) {
            if ($drawing->getCoordinates() === $coordinate) {
                $imagePath = $this->saveDrawing($drawing, $rowNumber);
                if ($imagePath) {
                    $payload['image'] = $imagePath;
                }
                break;
            }
        }
    }

    protected function saveDrawing($drawing, int $rowNumber): ?string
    {
        try {
            $extension = $this->getExtension($drawing);
            $filename = 'rawmaterial_import_' . $rowNumber . '_' . time() . '.' . $extension;
            $path = $this->imageStoragePath . '/' . $filename;

            if ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing) {
                $content = $drawing->getImageResource();
                if ($content) {
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, $content);
                    return $path;
                }
            } else {
                $sourcePath = $drawing->getPath();
                if ($sourcePath && file_exists($sourcePath)) {
                    $content = file_get_contents($sourcePath);
                    \Illuminate\Support\Facades\Storage::disk('public')->put($path, $content);
                    return $path;
                }
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to save image for row {$rowNumber}: " . $e->getMessage());
        }

        return null;
    }

    protected function getExtension($drawing): string
    {
        if ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing) {
            return 'png';
        }

        $path = $drawing->getPath();
        if ($path) {
            return pathinfo($path, PATHINFO_EXTENSION) ?: 'png';
        }

        return 'png';
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
}
