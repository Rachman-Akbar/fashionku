<?php

declare(strict_types=1);

namespace App\Domains\Shared\Excel\Application\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Validators\Failure;
use Maatwebsite\Excel\Events\BeforeImport;
use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\BeforeRow;
use Maatwebsite\Excel\Events\AfterRow;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;
use Throwable;

abstract class BaseImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsEmptyRows, WithMultipleSheets
{
    use Importable, SkipsErrors;

    protected string $modelClass;
    protected string $uniqueKey;
    protected array $relationMappings = [];
    protected int $importedCount = 0;
    protected int $failedCount = 0;
    protected array $errors = [];
    protected bool $extractImages = false;
    protected int $imageColumnIndex = 0;
    protected string $imagePathColumn = '';
    protected string $imageStoragePath = 'imports/images';

    abstract public function model(): string;
    abstract public function uniqueKey(): string;
    abstract public function rules(): array;
    abstract public function customValidation(array $row): array;

    /**
     * Hanya sheet pertama yang diimpor. Template punya sheet tambahan
     * ("contoh import", "penjelasan kolom") yang dulu ikut diproses dan
     * menghasilkan error validasi palsu.
     * Import multi-sheet (produk, kategori) menimpa method ini sendiri.
     */
    public function sheets(): array
    {
        return [0 => new SingleSheetImport($this)];
    }

    public function headingRow(): int
    {
        return 1;
    }

    public function customValidationMessages(): array
    {
        return [];
    }

    public function customValidationAttributes(): array
    {
        return [];
    }

    public function collection(Collection $rows): void
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;

                try {
                    $this->processRow($row, $rowNumber);
                    $this->importedCount++;
                } catch (Throwable $e) {
                    $this->failedCount++;
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'data' => $row->toArray(),
                        'error' => $e->getMessage(),
                    ];
                    Log::error("Import error at row {$rowNumber}: " . $e->getMessage());
                }
            }
        });
    }

    protected function processRow(Collection $row, int $rowNumber): void
    {
        $data = $row->toArray();
        $data = $this->normalizeData($data);

        $uniqueValue = $this->getUniqueValue($data);
        if (! $uniqueValue) {
            throw new \InvalidArgumentException("Unique key '{$this->uniqueKey()}' is required");
        }

        $existing = $this->findExisting($uniqueValue);

        $payload = $this->preparePayload($data, $existing);

        if ($this->extractImages) {
            $this->extractAndSaveImage($rowNumber, $payload);
        }

        $this->resolveRelations($payload);

        if ($existing) {
            $existing->update($payload);
        } else {
            $this->model()::create($payload);
        }
    }

    protected function normalizeData(array $data): array
    {
        $normalized = [];
        foreach ($data as $key => $value) {
            $normalized[strtolower(trim($key))] = $this->sanitizeValue($value);
        }
        return $normalized;
    }

    protected function sanitizeValue(mixed $value): mixed
    {
        // Jangan mengubah huruf: kode, SKU, nama produk/pelanggan dsb. harus
        // tetap seperti di file. Sebelumnya strtolower() membuat data impor
        // berubah jadi huruf kecil semua (mis. QA-CUST-01 → qa-cust-01).
        if (is_string($value)) {
            return trim($value);
        }

        return $value;
    }

    protected function getUniqueValue(array $data): ?string
    {
        $key = strtolower(trim($this->uniqueKey()));
        return $data[$key] ?? null;
    }

    protected function findExisting(string $uniqueValue)
    {
        $model = $this->model();
        $keyColumn = $this->getDatabaseKeyColumn();

        return $model::where($keyColumn, $uniqueValue)->first();
    }

    abstract protected function getDatabaseKeyColumn(): string;

    /**
     * Akses publik untuk controller (bulk delete / export terpilih):
     * getDatabaseKeyColumn() sendiri protected agar tidak jadi bagian API
     * importer.
     */
    public function databaseKeyColumn(): string
    {
        return $this->getDatabaseKeyColumn();
    }

    /**
     * Instance model modul ini. `new $this->model()` tidak valid karena PHP
     * membaca `$this->model` sebagai properti (bukan pemanggilan method),
     * sehingga muncul "Undefined property ...::$model" saat import.
     */
    public function modelInstance(): object
    {
        $class = $this->model();

        return new $class();
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        $payload = [];
        $fillable = $this->modelInstance()->getFillable();

        foreach ($fillable as $field) {
            $key = strtolower($field);
            if (isset($data[$key])) {
                $payload[$field] = $data[$key];
            }
        }

        if (! $existing) {
            $payload['created_by'] = auth()->id();
        }
        $payload['updated_by'] = auth()->id();

        return $payload;
    }

    protected function resolveRelations(array &$payload): void
    {
        foreach ($this->relationMappings as $relationKey => $mapping) {
            $inputKey = strtolower($mapping['input_key'] ?? $relationKey);
            if (! isset($payload[$inputKey]) || ! $payload[$inputKey]) {
                continue;
            }

            $value = $payload[$inputKey];
            $modelClass = $mapping['model'];
            $searchColumn = $mapping['search_column'];
            $targetColumn = $mapping['target_column'];

            $searchValue = strtolower(trim((string) $value));

            $related = $modelClass::where(function ($query) use ($searchColumn, $searchValue) {
                $query->whereRaw("LOWER(TRIM({$searchColumn})) = ?", [$searchValue]);
            })->first();

            if ($related) {
                $payload[$targetColumn] = $related->{$mapping['target_key'] ?? 'id'};
            } elseif ($mapping['create_missing'] ?? false) {
                $newRelated = $modelClass::create([
                    $searchColumn => trim((string) $value),
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]);
                $payload[$targetColumn] = $newRelated->{$mapping['target_key'] ?? 'id'};
            } else {
                unset($payload[$targetColumn]);
            }

            unset($payload[$inputKey]);
        }
    }

    protected function extractAndSaveImage(int $rowNumber, array &$payload): void
    {
        // This will be overridden in specific import classes
        // The actual extraction happens in BeforeImport event
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getFailedCount(): int
    {
        return $this->failedCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $this->failedCount++;
            $this->errors[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values(),
            ];
        }
    }
}