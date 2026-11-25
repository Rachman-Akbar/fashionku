<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Excel;

use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionModel;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PromotionImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = PromotionModel::class;
    protected string $uniqueKey = 'nama';
    protected bool $extractImages = true;
    protected int $imageColumnIndex = 0;
    protected string $imagePathColumn = 'image_url';
    protected string $imageStoragePath = 'promotions/imports';
    protected int $mobileImageColumnIndex = 1;
    protected string $mobileImagePathColumn = 'mobile_image_url';

    protected array $relationMappings = [];

    public function model(): string
    {
        return PromotionModel::class;
    }

    public function uniqueKey(): string
    {
        return 'nama';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'name';
    }

    public function rules(): array
    {
        return [
            'image_url' => 'nullable',
            'mobile_image_url' => 'nullable',
            'nama' => 'required|string|max:255',
            // Enum database hanya mendukung none/product/category/url.
            'jenis_klik' => 'nullable|in:none,product,category,url',
            // Excel mengirim sel angka sebagai int, jadi jangan paksa string.
            'target_id' => 'nullable|numeric|min:0',
            'target_url' => 'nullable|string|max:500',
            'urutan' => 'nullable|integer|min:0',
            'aktif' => 'nullable|in:ya,tidak,true,false,1,0',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['nama'])) {
            $errors['nama'] = 'Nama promosi wajib diisi';
        }

        $action = (string) ($row['jenis_klik'] ?? 'none');
        $targetId = (int) ($row['target_id'] ?? 0);

        if (in_array($action, ['product', 'category'], true)) {
            if ($targetId <= 0) {
                $errors['target_id'] = $action === 'product'
                    ? 'Produk target wajib dipilih.'
                    : 'Kategori target wajib dipilih.';
            } else {
                $exists = $action === 'product'
                    ? DB::table('products')->where('id', $targetId)->where('is_active', true)->where('status', 'published')->whereNull('deleted_at')->exists()
                    : DB::table('categories')->where('id', $targetId)->where('is_active', true)->whereNull('deleted_at')->exists();

                if (! $exists) {
                    $errors['target_id'] = $action === 'product'
                        ? 'Produk target tidak valid.'
                        : 'Kategori target tidak valid.';
                }
            }
        }

        if ($action === 'url' && empty($row['target_url'])) {
            $errors['target_url'] = 'URL target wajib diisi.';
        }

        return $errors;
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        $payload = [
            'name' => strtolower(trim($data['nama'] ?? '')),
            'click_action' => $data['jenis_klik'] ?? 'none',
            'target_id' => ! empty($data['target_id']) ? (int) $data['target_id'] : null,
            'target_url' => $data['target_url'] ?? '',
            // image_url / mobile_image_url NOT NULL tanpa default → isi string kosong saat create,
            // tapi jangan timpa gambar lama saat update kalau kolomnya kosong.
            'image_url' => (string) ($data['image_url'] ?? ''),
            'mobile_image_url' => (string) ($data['mobile_image_url'] ?? ''),
            'sort_order' => (int) ($data['urutan'] ?? 0),
            'is_active' => $this->parseBoolean($data['aktif'] ?? true),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ];

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

    public function collection(Collection $rows): void
    {
        DB::transaction(function () use ($rows) {
            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;

                try {
                    $data = $row->toArray();
                    $data = $this->normalizeData($data);

                    $uniqueValue = $this->getUniqueValue($data);
                    if (! $uniqueValue) {
                        throw new \InvalidArgumentException("Nama promosi wajib diisi");
                    }

                    $existing = $this->findExisting($uniqueValue);

                    $payload = $this->preparePayload($data, $existing);

                    if ($existing) {
                        // Jangan hapus gambar yang sudah ada kalau sel Excel-nya kosong.
                        if ($payload['image_url'] === '') {
                            unset($payload['image_url']);
                        }
                        if ($payload['mobile_image_url'] === '') {
                            unset($payload['mobile_image_url']);
                        }
                    }

                    if ($this->extractImages) {
                        $this->extractAndSavePromotionImage($rowNumber, $payload, 'image_url', $this->imageColumnIndex);
                        $this->extractAndSavePromotionImage($rowNumber, $payload, 'mobile_image_url', $this->mobileImageColumnIndex);
                    }

                    if ($existing) {
                        $existing->update($payload);
                    } else {
                        PromotionModel::create($payload);
                    }

                    $this->importedCount++;
                } catch (\Throwable $e) {
                    $this->failedCount++;
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'data' => $row->toArray(),
                        'error' => $e->getMessage(),
                    ];
                    \Illuminate\Support\Facades\Log::error("Promotion import error at row {$rowNumber}: " . $e->getMessage());
                }
            }
        });
    }

    /**
     * Nama method sengaja berbeda dari BaseImport::extractAndSaveImage().
     * Kalau memakai nama yang sama dengan parameter tambahan, PHP melempar
     * "Declaration ... must be compatible with ..." (fatal) sehingga
     * import promosi tidak bisa dipakai sama sekali.
     */
    protected function extractAndSavePromotionImage(int $rowNumber, array &$payload, string $field, int $columnIndex): void
    {
        if (! isset($this->spreadsheet)) {
            return;
        }

        $sheet = $this->spreadsheet->getActiveSheet();
        $coordinate = $this->getColumnLetter($columnIndex) . ($rowNumber + 1);
        $drawings = $sheet->getDrawingCollection();

        foreach ($drawings as $drawing) {
            if ($drawing->getCoordinates() === $coordinate) {
                $imagePath = $this->saveDrawing($drawing, $rowNumber, $field);
                if ($imagePath) {
                    $payload[$field] = $imagePath;
                }
                break;
            }
        }
    }

    protected function saveDrawing($drawing, int $rowNumber, string $field): ?string
    {
        try {
            $extension = $this->getExtension($drawing);
            $filename = 'promotion_' . $field . '_import_' . $rowNumber . '_' . time() . '.' . $extension;
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
            \Illuminate\Support\Facades\Log::warning("Failed to save {$field} image for row {$rowNumber}: " . $e->getMessage());
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
