<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\Excel;

use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class VoucherImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = Voucher::class;
    protected string $uniqueKey = 'kode_voucher';
    protected bool $extractImages = true;
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'image';
    protected string $imageStoragePath = 'vouchers/imports';

    protected array $relationMappings = [
        'produk_terkait' => [
            'model' => ProductModel::class,
            'search_column' => 'sku',
            'target_column' => 'voucher_products',
            'target_key' => 'id',
            'create_missing' => false,
        ],
    ];

    public function model(): string
    {
        return Voucher::class;
    }

    public function uniqueKey(): string
    {
        return 'kode_voucher';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'code';
    }

    public function rules(): array
    {
        return [
            'kode_voucher' => 'required|string|max:50|unique:vouchers,code',
            'image' => 'nullable',
            'nama' => 'required|string|max:255',
            'target_diskon' => 'nullable|in:product,shipping',
            'tipe_diskon' => 'nullable|in:fixed,percentage',
            'nilai_diskon' => 'required|numeric|min:0',
            'min_belanja' => 'nullable|numeric|min:0',
            'min_item' => 'nullable|integer|min:0',
            'min_produk_berbeda' => 'nullable|integer|min:0',
            'maks_diskon' => 'nullable|numeric|min:0',
            'mulai' => 'nullable|date_format:Y-m-d H:i',
            'berakhir' => 'nullable|date_format:Y-m-d H:i',
            'limit_pemakaian' => 'nullable|integer|min:0',
            'limit_per_user' => 'nullable|integer|min:0',
            'syarat_ketentuan' => 'nullable|string',
            'produk_terkait' => 'nullable|string',
            'aktif' => 'nullable|in:ya,tidak,true,false,1,0',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['kode_voucher'])) {
            $errors['kode_voucher'] = 'Kode voucher wajib diisi';
        }

        if (empty($row['nama'])) {
            $errors['nama'] = 'Nama voucher wajib diisi';
        }

        if (! isset($row['nilai_diskon']) || $row['nilai_diskon'] <= 0) {
            $errors['nilai_diskon'] = 'Nilai diskon harus > 0';
        }

        if (($row['tipe_diskon'] ?? '') === 'percentage' && ($row['nilai_diskon'] ?? 0) > 100) {
            $errors['nilai_diskon'] = 'Diskon persen max 100%';
        }

        if (isset($row['mulai'], $row['berakhir']) && $row['mulai'] && $row['berakhir']) {
            if (strtotime($row['mulai']) >= strtotime($row['berakhir'])) {
                $errors['berakhir'] = 'Tanggal berakhir harus setelah mulai';
            }
        }

        return $errors;
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        $payload = [
            'code' => strtolower(trim($data['kode_voucher'] ?? '')),
            'name' => $data['nama'] ?? '',
            'discount_target' => $data['target_diskon'] ?? 'product',
            'discount_type' => $data['tipe_diskon'] ?? 'percentage',
            'discount_value' => (float) ($data['nilai_diskon'] ?? 0),
            'min_spend' => (float) ($data['min_belanja'] ?? 0),
            'min_items' => (int) ($data['min_item'] ?? 0),
            'min_distinct_products' => (int) ($data['min_produk_berbeda'] ?? 0),
            'max_discount' => (float) ($data['maks_diskon'] ?? 0),
            'terms' => $data['syarat_ketentuan'] ?? '',
            'usage_limit' => (int) ($data['limit_pemakaian'] ?? 0),
            'usage_limit_per_user' => (int) ($data['limit_per_user'] ?? 0),
            'is_active' => $this->parseBoolean($data['aktif'] ?? true),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ];

        if (isset($data['mulai']) && $data['mulai']) {
            $payload['starts_at'] = \Carbon\Carbon::parse($data['mulai']);
        }

        if (isset($data['berakhir']) && $data['berakhir']) {
            $payload['ends_at'] = \Carbon\Carbon::parse($data['berakhir']);
        }

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
                        throw new \InvalidArgumentException("Kode voucher wajib diisi");
                    }

                    $existing = $this->findExisting($uniqueValue);

                    $payload = $this->preparePayload($data, $existing);

                    if ($this->extractImages) {
                        $this->extractAndSaveImage($rowNumber, $payload);
                    }

                    $productCodes = $data['produk_terkait'] ?? '';

                    if ($existing) {
                        $existing->update($payload);
                        $voucherId = $existing->id;
                    } else {
                        $voucher = Voucher::create($payload);
                        $voucherId = $voucher->id;
                    }

                    // Handle product relations
                    if ($productCodes) {
                        $codes = array_map('trim', explode(';', $productCodes));
                        $codes = array_filter($codes);

                        $productIds = ProductModel::whereIn('sku', $codes)->pluck('id')->toArray();

                        DB::table('voucher_products')
                            ->where('voucher_id', $voucherId)
                            ->whereNotIn('product_id', $productIds)
                            ->delete();

                        foreach ($productIds as $productId) {
                            DB::table('voucher_products')->updateOrInsert(
                                ['voucher_id' => $voucherId, 'product_id' => $productId],
                                ['created_at' => now(), 'updated_at' => now()]
                            );
                        }
                    }

                    $this->importedCount++;
                } catch (\Throwable $e) {
                    $this->failedCount++;
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'data' => $row->toArray(),
                        'error' => $e->getMessage(),
                    ];
                    \Illuminate\Support\Facades\Log::error("Voucher import error at row {$rowNumber}: " . $e->getMessage());
                }
            }
        });
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
            $filename = 'voucher_import_' . $rowNumber . '_' . time() . '.' . $extension;
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
