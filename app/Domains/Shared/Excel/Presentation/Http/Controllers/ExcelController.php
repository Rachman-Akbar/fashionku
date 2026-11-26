<?php

declare(strict_types=1);

namespace App\Domains\Shared\Excel\Presentation\Http\Controllers;

use App\Domains\Catalog\Category\Application\Excel\CategoryExport;
use App\Domains\Catalog\Category\Application\Excel\CategoryImport;
use App\Domains\Catalog\Category\Application\Excel\CategoryTemplateExport;
use App\Domains\Catalog\Category\Application\Services\CategoryTreeService;
use App\Domains\Catalog\Product\Application\Excel\ProductExport;
use App\Domains\Catalog\Product\Application\Excel\ProductImport;
use App\Domains\Catalog\Product\Application\Excel\ProductTemplateExport;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Catalog\Promotion\Application\Excel\PromotionExport;
use App\Domains\Catalog\Promotion\Application\Excel\PromotionImport;
use App\Domains\Catalog\Promotion\Application\Excel\PromotionTemplateExport;
use App\Domains\Identity\User\Application\Excel\UserExport;
use App\Domains\Identity\User\Application\Excel\UserImport;
use App\Domains\Identity\User\Application\Excel\UserTemplateExport;
use App\Domains\Order\Ordering\Application\Excel\SalesExport;
use App\Domains\Order\Ordering\Application\Excel\SalesImport;
use App\Domains\Order\Ordering\Application\Excel\SalesTemplateExport;
use App\Domains\Order\Voucher\Application\Excel\VoucherExport;
use App\Domains\Order\Voucher\Application\Excel\VoucherImport;
use App\Domains\Order\Voucher\Application\Excel\VoucherTemplateExport;
use App\Domains\Seller\Customers\Application\Excel\CustomerExport;
use App\Domains\Seller\Customers\Application\Excel\CustomerImport;
use App\Domains\Seller\Customers\Application\Excel\CustomerTemplateExport;
use App\Domains\Seller\Finance\Application\Excel\FinanceExport;
use App\Domains\Seller\Finance\Application\Excel\FinanceImport;
use App\Domains\Seller\Finance\Application\Excel\FinanceTemplateExport;
use App\Domains\Seller\Inventory\Application\Excel\RawMaterialExport;
use App\Domains\Seller\Inventory\Application\Excel\RawMaterialImport;
use App\Domains\Seller\Inventory\Application\Excel\RawMaterialTemplateExport;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Seller\Stock\Application\Excel\StockExport;
use App\Domains\Seller\Stock\Application\Excel\StockImport;
use App\Domains\Seller\Stock\Application\Excel\StockTemplateExport;
use App\Domains\Shared\Excel\Application\Exports\ErrorExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

final class ExcelController extends Controller
{
    private const MODULES = [
        'product' => [
            'export' => ProductExport::class,
            'import' => ProductImport::class,
            'template' => ProductTemplateExport::class,
            'label' => 'Produk',
            // Relasi yang sama dengan export penuh. Tanpa eager load, hasil
            // filter (export sebagian) kehilangan kategori/varian/gambar dan
            // memicu N+1 sehingga data di file berbeda dari yang di layar.
            'eager' => ['primaryCategory.parent.parent', 'variants.values.attribute'],
        ],
        'category' => [
            'export' => CategoryExport::class,
            'import' => CategoryImport::class,
            'template' => CategoryTemplateExport::class,
            'label' => 'Kategori',
        ],
        'raw-material' => [
            'export' => RawMaterialExport::class,
            'import' => RawMaterialImport::class,
            'template' => RawMaterialTemplateExport::class,
            'label' => 'Bahan Baku',
        ],
        'customer' => [
            'export' => CustomerExport::class,
            'import' => CustomerImport::class,
            'template' => CustomerTemplateExport::class,
            'label' => 'Pelanggan',
        ],
        'stock' => [
            'export' => StockExport::class,
            'import' => StockImport::class,
            'template' => StockTemplateExport::class,
            'label' => 'Stok Produk',
        ],
        'sales' => [
            'export' => SalesExport::class,
            'import' => SalesImport::class,
            'template' => SalesTemplateExport::class,
            'label' => 'Penjualan',
        ],
        'finance' => [
            'export' => FinanceExport::class,
            'import' => FinanceImport::class,
            'template' => FinanceTemplateExport::class,
            'label' => 'Keuangan',
        ],
        'user' => [
            'export' => UserExport::class,
            'import' => UserImport::class,
            'template' => UserTemplateExport::class,
            'label' => 'Pengguna',
        ],
        'voucher' => [
            'export' => VoucherExport::class,
            'import' => VoucherImport::class,
            'template' => VoucherTemplateExport::class,
            'label' => 'Voucher',
        ],
        'promotion' => [
            'export' => PromotionExport::class,
            'import' => PromotionImport::class,
            'template' => PromotionTemplateExport::class,
            'label' => 'Promosi',
        ],
    ];

    public function template(Request $request, string $module): BinaryFileResponse
    {
        $config = $this->getModuleConfig($module);

        $export = new $config['template'];

        $filename = "{$module}-template.xlsx";

        return Excel::download($export, $filename);
    }

    public function export(Request $request, string $module): BinaryFileResponse
    {
        $config = $this->getModuleConfig($module);

        $request->validate([
            'ids' => 'nullable|array',
            'ids.*' => 'nullable|integer',
            'filters' => 'nullable|array',
        ]);

        $ids = $request->input('ids', []);
        $filters = $request->input('filters', []);

        $exportClass = $config['export'];

        $export = new $exportClass($this->getFilteredCollection($module, $ids, $filters));

        $filename = "{$module}-export-".now()->format('Ymd-His').'.xlsx';

        return Excel::download($export, $filename);
    }

    public function import(Request $request, string $module): JsonResponse|BinaryFileResponse
    {
        $config = $this->getModuleConfig($module);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'create_missing_relations' => 'nullable|boolean',
        ]);

        $file = $request->file('file');
        $createMissingRelations = (bool) $request->input('create_missing_relations', false);

        config(['excel.import.create_missing_relations' => $createMissingRelations]);

        $importClass = $config['import'];
        $import = new $importClass;

        Excel::import($import, $file);

        $successCount = $import->getImportedCount();
        $errorCount = $import->getFailedCount();
        $errors = $import->getErrors();

        if ($errorCount > 0) {
            $errorExport = new ErrorExport($errors, $config['label']);
            $errorFilename = "{$module}-import-errors-".now()->format('Ymd-His').'.xlsx';

            // BinaryFileResponse tidak punya withHeaders(); gunakan header bag
            // supaya UI tetap menerima jumlah sukses/gagal. Sebelumnya baris ini
            // melempar Error dan membuat respons error jadi 500.
            $response = Excel::download($errorExport, $errorFilename);
            $response->headers->set('X-Import-Success-Count', (string) $successCount);
            $response->headers->set('X-Import-Error-Count', (string) $errorCount);

            return $response;
        }

        return response()->json([
            'success' => true,
            'message' => 'Import selesai.',
            'data' => [
                'success_count' => $successCount,
                'error_count' => $errorCount,
            ],
        ]);
    }

    public function preview(Request $request, string $module): JsonResponse
    {
        $config = $this->getModuleConfig($module);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'import_mode' => 'nullable|string|in:create,update,upsert',
        ]);

        $file = $request->file('file');
        $importMode = $request->input('import_mode', 'upsert');

        if ($module === 'product') {
            return $this->previewProduct($file->getRealPath(), $importMode);
        }

        if ($module === 'category') {
            return $this->previewCategory($file->getRealPath(), $importMode);
        }

        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, false, true, true);

        if (empty($rows)) {
            return response()->json([
                'success' => false,
                'message' => 'File kosong atau tidak dapat dibaca.',
            ], 422);
        }

        $headers = array_shift($rows);
        $headers = array_map(fn ($h) => strtolower(trim((string) $h)), $headers);

        $importClass = $config['import'];
        $import = new $importClass;

        $requiredColumns = $this->getRequiredColumns($import);
        $keyColumn = strtolower($import->uniqueKey());

        $missingHeaders = array_diff($requiredColumns, $headers);
        if (! empty($missingHeaders)) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom wajib hilang: '.implode(', ', $missingHeaders),
            ], 422);
        }

        $totalRows = 0;
        $validRows = 0;
        $invalidRows = 0;
        $previewRows = [];
        $seenKeys = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $data = [];
            $errors = [];

            // $headers memakai key kolom huruf (A, B, C, ...) karena
            // toArray(..., true). Konversi ke indeks angka dulu; sebelumnya
            // `$colIndex + 1` melempar TypeError "Unsupported operand types:
            // string + int" untuk semua modul selain product & category.
            foreach ($headers as $colIndex => $header) {
                $columnNumber = is_int($colIndex) ? $colIndex + 1 : Coordinate::columnIndexFromString((string) $colIndex);
                $data[$header] = $row[$colIndex] ?? $row[$columnNumber] ?? null;
            }

            // Template berisi 100 baris berformat yang masih kosong. Baris kosong
            // tidak boleh dihitung sebagai error (dulu: 99 baris kosong → 198 error).
            $hasValue = false;
            foreach ($data as $value) {
                if ($value !== null && trim((string) $value) !== '') {
                    $hasValue = true;
                    break;
                }
            }
            if (! $hasValue) {
                continue;
            }

            $totalRows++;

            $keyValue = trim((string) ($data[$keyColumn] ?? ''));
            if ($keyValue === '') {
                $errors[] = 'Kode unik wajib diisi';
            } elseif (isset($seenKeys[$keyValue])) {
                $errors[] = "Kode duplikat dalam file: {$keyValue}";
            } else {
                $seenKeys[$keyValue] = true;

                if ($importMode === 'create') {
                    $existing = $import->findExisting($keyValue);
                    if ($existing) {
                        $errors[] = 'Kode sudah terdaftar';
                    }
                } elseif ($importMode === 'update') {
                    $existing = $import->findExisting($keyValue);
                    if (! $existing) {
                        $errors[] = 'Kode tidak ditemukan';
                    }
                }
            }

            foreach ($requiredColumns as $required) {
                if (! isset($data[$required]) || trim((string) $data[$required]) === '') {
                    $errors[] = "Kolom {$required} wajib diisi";
                }
            }

            if (empty($errors)) {
                $validRows++;
            } else {
                $invalidRows++;
            }

            $previewRows[] = [
                'row' => $rowNumber,
                'data' => $data,
                'errors' => $errors,
                'valid' => empty($errors),
            ];
        }

        $canContinue = $invalidRows === 0;
        $requiresConfirmation = $invalidRows > 0 && $validRows > 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_rows' => $totalRows,
                'valid_rows' => $validRows,
                'invalid_rows' => $invalidRows,
                'requires_confirmation' => $requiresConfirmation,
                'can_continue' => $canContinue,
                'preview' => $previewRows,
            ],
        ]);
    }

    private function getModuleConfig(string $module): array
    {
        if (! isset(self::MODULES[$module])) {
            abort(404, "Modul {$module} tidak ditemukan");
        }

        return self::MODULES[$module];
    }

    private function getFilteredCollection(string $module, array $ids, array $filters): ?Collection
    {
        // Tanpa filter, biarkan kelas export memakai query bawaannya
        // (masing-masing punya default collection() sendiri).
        if (empty($ids) && empty($filters)) {
            return null;
        }

        $config = $this->getModuleConfig($module);
        $importClass = $config['import'];
        $import = new $importClass;

        $model = new ($import->model())();
        $query = $model->newQuery();

        if (! empty($ids)) {
            $query->whereIn($import->databaseKeyColumn(), $ids);
        }

        foreach ($filters as $column => $value) {
            if (! is_string($column) || $value === null || $value === '') {
                continue;
            }

            if (! Schema::hasColumn($model->getTable(), $column)) {
                continue;
            }

            if (is_array($value)) {
                $query->whereIn($column, $value);
            } else {
                $query->where($column, $value);
            }
        }

        $eager = $config['eager'] ?? [];
        if (! empty($eager)) {
            $query->with($eager);
        }

        return $query->get();
    }

    private function previewProduct(string $path, string $importMode): JsonResponse
    {
        $spreadsheet = IOFactory::load($path);
        $service = app(CategoryTreeService::class);

        $productSheet = $spreadsheet->getSheetByName('template_produk')
            ?? $spreadsheet->getSheetByName('produk')
            ?? $spreadsheet->getSheet(0);
        $bomSheet = $spreadsheet->getSheetByName('template_bahan_baku')
            ?? $spreadsheet->getSheetByName('bahan_baku');

        $productRows = $productSheet->toArray(null, true, true, false);
        $headers = array_map(fn ($value): string => strtolower(trim((string) $value)), array_shift($productRows) ?? []);

        $requiredColumns = ['kode_produk', 'nama_produk', 'kode_sku_varian'];
        $missingHeaders = array_diff($requiredColumns, $headers);
        if ($missingHeaders !== []) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom wajib hilang: '.implode(', ', $missingHeaders),
            ], 422);
        }

        // Kategori boleh format ringkas (satu kolom "kategori") atau format lama
        // (kategori_level_1..3). Salah satu wajib ada.
        if (! in_array('kategori', $headers, true) && ! in_array('kategori_level_1', $headers, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom wajib hilang: kategori',
            ], 422);
        }

        $previewRows = [];
        $validRows = 0;
        $invalidRows = 0;
        $seenSkus = [];

        foreach ($productRows as $index => $row) {
            $rowNumber = $index + 2;
            $data = [];
            foreach ($headers as $columnIndex => $header) {
                $data[$header] = $row[$columnIndex] ?? null;
            }

            if (trim(implode('', array_map(fn ($value): string => (string) $value, $data))) === '') {
                continue;
            }

            $errors = [];
            $code = trim((string) ($data['kode_produk'] ?? ''));
            $name = trim((string) ($data['nama_produk'] ?? ''));
            $sku = trim((string) ($data['kode_sku_varian'] ?? ''));

            if ($code === '') {
                $errors[] = "Baris {$rowNumber}: kode_produk wajib diisi.";
            }
            if ($name === '') {
                $errors[] = "Baris {$rowNumber}: nama_produk wajib diisi.";
            }

            $single = trim((string) ($data['kategori'] ?? ''));
            if ($single !== '') {
                if (! $service->findByName($single)) {
                    $errors[] = "Baris {$rowNumber}: Kategori '{$single}' tidak ditemukan di database.";
                }
            } else {
                $levels = $service->levelsFromRow($data);
                if ($levels[0] === '') {
                    $errors[] = "Baris {$rowNumber}: kategori wajib diisi.";
                } elseif ($levels[2] !== '' && $levels[1] === '') {
                    $errors[] = "Baris {$rowNumber}: kategori_level_3 diisi tetapi kategori_level_2 kosong.";
                } elseif (! $service->findPath($levels)) {
                    $errors[] = "Baris {$rowNumber}: Kombinasi kategori '".implode(' > ', array_filter($levels))."' tidak ditemukan di database.";
                }
            }

            if ($sku === '') {
                $errors[] = "Baris {$rowNumber}: kode_sku_varian wajib diisi.";
            } elseif (isset($seenSkus[strtolower($sku)])) {
                $errors[] = "Baris {$rowNumber}: SKU varian {$sku} duplikat dalam file.";
            } else {
                $seenSkus[strtolower($sku)] = true;
                $exists = ProductVariantModel::query()
                    ->whereRaw('LOWER(TRIM(sku)) = ?', [strtolower($sku)])
                    ->exists();

                if ($importMode === 'create' && $exists) {
                    $errors[] = "Baris {$rowNumber}: SKU varian {$sku} sudah terdaftar.";
                }
                if ($importMode === 'update' && ! $exists) {
                    $errors[] = "Baris {$rowNumber}: SKU varian {$sku} tidak ditemukan.";
                }
            }

            if (($data['harga'] ?? '') !== '' && ! is_numeric($data['harga'])) {
                $errors[] = "Baris {$rowNumber}: harga harus berupa angka.";
            }

            if ($errors === []) {
                $validRows++;
            } else {
                $invalidRows++;
            }

            $previewRows[] = ['row' => $rowNumber, 'data' => $data, 'errors' => $errors, 'valid' => $errors === []];
        }

        if ($bomSheet) {
            $bomRows = $bomSheet->toArray(null, true, true, false);
            $bomHeaders = array_map(fn ($value): string => strtolower(trim((string) $value)), array_shift($bomRows) ?? []);

            foreach ($bomRows as $index => $row) {
                $rowNumber = $index + 2;
                $data = [];
                foreach ($bomHeaders as $columnIndex => $header) {
                    $data[$header] = $row[$columnIndex] ?? null;
                }

                if (trim(implode('', array_map(fn ($value): string => (string) $value, $data))) === '') {
                    continue;
                }

                $errors = [];
                $sku = trim((string) ($data['kode_sku_varian'] ?? ''));
                $materialCode = trim((string) ($data['kode_bahan'] ?? ''));
                $quantity = (float) ($data['qty_pakai'] ?? 0);

                $skuExists = isset($seenSkus[strtolower($sku)])
                    || ProductVariantModel::query()->whereRaw('LOWER(TRIM(sku)) = ?', [strtolower($sku)])->exists();

                if ($sku === '') {
                    $errors[] = "Baris {$rowNumber}: kode_sku_varian wajib diisi.";
                } elseif (! $skuExists) {
                    $errors[] = "Baris {$rowNumber}: Kode SKU varian {$sku} tidak ditemukan.";
                }

                if ($materialCode === '') {
                    $errors[] = "Baris {$rowNumber}: kode_bahan wajib diisi.";
                } elseif (! RawMaterialModel::query()->whereRaw('LOWER(TRIM(code)) = ?', [strtolower($materialCode)])->exists()) {
                    $errors[] = "Baris {$rowNumber}: Kode bahan {$materialCode} tidak ditemukan.";
                }

                if ($quantity <= 0) {
                    $errors[] = "Baris {$rowNumber}: qty_pakai harus lebih besar dari 0.";
                }

                if ($errors === []) {
                    $validRows++;
                } else {
                    $invalidRows++;
                }

                $previewRows[] = ['row' => $rowNumber, 'data' => $data, 'errors' => $errors, 'valid' => $errors === []];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_rows' => $validRows + $invalidRows,
                'valid_rows' => $validRows,
                'invalid_rows' => $invalidRows,
                'requires_confirmation' => $invalidRows > 0 && $validRows > 0,
                'can_continue' => $invalidRows === 0,
                'preview' => $previewRows,
            ],
        ]);
    }

    private function previewCategory(string $path, string $importMode): JsonResponse
    {
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getSheet(0);
        $rows = $sheet->toArray(null, true, true, false);
        $headers = array_map(fn ($value): string => strtolower(trim((string) $value)), array_shift($rows) ?? []);

        $requiredColumns = ['kategori_level_1'];
        $missingHeaders = array_diff($requiredColumns, $headers);
        if ($missingHeaders !== []) {
            return response()->json([
                'success' => false,
                'message' => 'Kolom wajib hilang: '.implode(', ', $missingHeaders),
            ], 422);
        }

        $service = app(CategoryTreeService::class);
        $validRows = 0;
        $invalidRows = 0;
        $previewRows = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $data = [];
            foreach ($headers as $columnIndex => $header) {
                $data[$header] = $row[$columnIndex] ?? null;
            }

            $levels = $service->levelsFromRow($data);
            if (implode('', $levels) === '') {
                continue;
            }

            $errors = [];
            if ($levels[0] === '') {
                $errors[] = "Baris {$rowNumber}: kategori_level_1 wajib diisi.";
            }
            if ($levels[2] !== '' && $levels[1] === '') {
                $errors[] = "Baris {$rowNumber}: kategori_level_3 diisi tetapi kategori_level_2 kosong.";
            }

            if ($errors === []) {
                $validRows++;
            } else {
                $invalidRows++;
            }

            $previewRows[] = ['row' => $rowNumber, 'data' => $data, 'errors' => $errors, 'valid' => $errors === []];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_rows' => $validRows + $invalidRows,
                'valid_rows' => $validRows,
                'invalid_rows' => $invalidRows,
                'requires_confirmation' => false,
                'can_continue' => $invalidRows === 0,
                'preview' => $previewRows,
            ],
        ]);
    }

    private function getRequiredColumns($import): array
    {
        $rules = $import->rules();
        $required = [];

        foreach ($rules as $field => $rule) {
            if (is_string($rule)) {
                $ruleParts = explode('|', $rule);
                if (in_array('required', $ruleParts)) {
                    $required[] = strtolower($field);
                }
            } elseif (is_array($rule)) {
                if (in_array('required', $rule)) {
                    $required[] = strtolower($field);
                }
            }
        }

        return $required;
    }

    public function bulkDelete(Request $request, string $module): JsonResponse
    {
        $config = $this->getModuleConfig($module);

        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer',
        ]);

        $ids = $request->input('ids');

        $modelClass = $config['import'];
        $import = new $modelClass;
        $table = $import->modelInstance()->getTable();
        $keyColumn = $import->databaseKeyColumn();

        $deleted = DB::table($table)->whereIn($keyColumn, $ids)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus.',
            'data' => [
                'deleted_count' => $deleted,
            ],
        ]);
    }
}
