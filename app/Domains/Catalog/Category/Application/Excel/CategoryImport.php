<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Excel;

use App\Domains\Catalog\Category\Application\Services\CategoryTreeService;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsUnknownSheets;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Events\BeforeImport;
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;
use Throwable;

class CategoryImport extends BaseImport implements SkipsUnknownSheets, WithEvents, WithMultipleSheets
{
    use Importable;

    protected string $modelClass = CategoryModel::class;

    protected string $uniqueKey = 'kategori_level_1';

    protected bool $extractImages = true;

    protected int $imageColumnIndex = 3;

    protected string $imagePathColumn = 'image_url';

    protected string $imageStoragePath = 'categories/imports';

    public $spreadsheet;

    public function model(): string
    {
        return CategoryModel::class;
    }

    public function uniqueKey(): string
    {
        return 'kategori_level_1';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'id';
    }

    /**
     * Hanya sheet pertama (template) yang diproses; sheet contoh & penjelasan diabaikan.
     */
    public function sheets(): array
    {
        return [0 => $this];
    }

    public function onUnknownSheet(string|int $sheetName): void
    {
        // Abaikan sheet contoh import / penjelasan kolom.
    }

    public function registerEvents(): array
    {
        return [
            BeforeImport::class => function (BeforeImport $event): void {
                $import = $event->getConcernable();
                if ($import instanceof self) {
                    $import->spreadsheet = $event->getReader()->getDelegate();
                }
            },
        ];
    }

    public function rules(): array
    {
        return [
            'kategori_level_1' => 'required|string|max:255',
            'kategori_level_2' => 'nullable|string|max:255',
            'kategori_level_3' => 'nullable|string|max:255',
            'image_url' => 'nullable|string',
            'icon_url' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'aktif' => 'nullable|in:ya,tidak,true,false,1,0',
            'visible_in_menu' => 'nullable|in:ya,tidak,true,false,1,0',
        ];
    }

    public function customValidation(array $row): array
    {
        return [];
    }

    public function collection(Collection $rows): void
    {
        $service = app(CategoryTreeService::class);

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $data = $this->normalizeRow($row->toArray());

            if ($this->isEmptyRow($data)) {
                continue;
            }

            try {
                DB::transaction(function () use ($data, $rowNumber, $service): void {
                    $levels = $service->levelsFromRow($data);

                    if ($levels[0] === '') {
                        throw new \InvalidArgumentException('kategori_level_1 wajib diisi.');
                    }

                    if ($levels[2] !== '' && $levels[1] === '') {
                        throw new \InvalidArgumentException('kategori_level_3 diisi tetapi kategori_level_2 kosong.');
                    }

                    $payload = [
                        'sort_order' => (int) ($data['sort_order'] ?? 0),
                        'is_active' => $this->parseBoolean($data['aktif'] ?? true),
                        'is_visible_in_menu' => $this->parseBoolean($data['visible_in_menu'] ?? true),
                    ];

                    if ($this->extractImages) {
                        $this->extractAndSaveImage($rowNumber, $payload);
                    }

                    if (! empty($data['image_url']) && is_string($data['image_url'])) {
                        $payload['image_url'] = $data['image_url'];
                    }

                    if (! empty($data['icon_url']) && is_string($data['icon_url'])) {
                        $payload['icon_url'] = $data['icon_url'];
                    }

                    $service->resolveOrCreate($levels, $payload);
                });

                $this->importedCount++;
            } catch (Throwable $exception) {
                $this->failedCount++;
                $this->errors[] = [
                    'row' => $rowNumber,
                    'data' => $data,
                    'error' => "Baris {$rowNumber}: ".$exception->getMessage(),
                ];
                Log::warning("Category import row {$rowNumber}: ".$exception->getMessage());
            }
        }
    }

    private function normalizeRow(array $data): array
    {
        $normalized = [];

        foreach ($data as $key => $value) {
            $key = strtolower(trim((string) $key));
            $normalized[$key] = is_string($value) ? trim($value) : $value;
        }

        return $normalized;
    }

    private function isEmptyRow(array $data): bool
    {
        return trim((string) ($data['kategori_level_1'] ?? '')) === ''
            && trim((string) ($data['kategori_level_2'] ?? '')) === ''
            && trim((string) ($data['kategori_level_3'] ?? '')) === '';
    }

    private function parseBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return in_array(strtolower(trim((string) $value)), ['ya', 'true', '1', 'yes'], true);
    }

    protected function extractAndSaveImage(int $rowNumber, array &$payload): void
    {
        if (! $this->spreadsheet) {
            return;
        }

        $sheet = $this->spreadsheet->getSheet(0);
        $coordinate = $this->getColumnLetter($this->imageColumnIndex).($rowNumber + 1);

        foreach ($sheet->getDrawingCollection() as $drawing) {
            if ($drawing->getCoordinates() !== $coordinate) {
                continue;
            }

            $imagePath = $this->saveDrawing($drawing, $rowNumber);
            if ($imagePath) {
                $payload['image_url'] = $imagePath;
            }

            return;
        }
    }

    protected function saveDrawing($drawing, int $rowNumber): ?string
    {
        try {
            $extension = $this->getExtension($drawing);
            $filename = 'category_import_'.$rowNumber.'_'.time().'.'.$extension;
            $path = $this->imageStoragePath.'/'.$filename;

            if ($drawing instanceof MemoryDrawing) {
                $content = $drawing->getImageResource();
                if ($content) {
                    Storage::disk('public')->put($path, $content);

                    return $path;
                }
            } else {
                $sourcePath = $drawing->getPath();
                if ($sourcePath && file_exists($sourcePath)) {
                    Storage::disk('public')->put($path, file_get_contents($sourcePath));

                    return $path;
                }
            }
        } catch (Throwable $exception) {
            Log::warning("Failed to save category image for row {$rowNumber}: ".$exception->getMessage());
        }

        return null;
    }

    protected function getExtension($drawing): string
    {
        if ($drawing instanceof MemoryDrawing) {
            return 'png';
        }

        $path = $drawing->getPath();

        return $path ? (pathinfo($path, PATHINFO_EXTENSION) ?: 'png') : 'png';
    }

    protected function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr(65 + ($index % 26)).$letter;
            $index = intdiv($index, 26) - 1;
        }

        return $letter;
    }
}
