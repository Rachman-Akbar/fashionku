<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Excel;

use App\Domains\Catalog\Category\Application\Services\CategoryTreeService;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductAttributeModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantMaterialModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantValueModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsUnknownSheets;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Events\BeforeImport;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing;
use Throwable;

final class ProductRowSheet implements ToCollection, WithHeadingRow
{
    public function __construct(private ProductImport $import) {}

    public function collection(Collection $rows): void
    {
        $this->import->importProductRows($rows);
    }
}

final class ProductMaterialSheet implements ToCollection, WithHeadingRow
{
    public function __construct(private ProductImport $import) {}

    public function collection(Collection $rows): void
    {
        $this->import->importMaterialRows($rows);
    }
}

class ProductImport extends BaseImport implements SkipsUnknownSheets, WithEvents, WithMultipleSheets
{
    use Importable;

    protected string $modelClass = ProductModel::class;

    protected string $uniqueKey = 'kode_produk';

    protected bool $extractImages = true;

    protected int $imageColumnIndex = 1;

    protected string $imagePathColumn = 'thumbnail';

    protected string $imageStoragePath = 'products/imports';

    public $spreadsheet;

    public function model(): string
    {
        return ProductModel::class;
    }

    public function uniqueKey(): string
    {
        return 'kode_produk';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'id';
    }

    public function sheets(): array
    {
        return [
            'template_produk' => new ProductRowSheet($this),
            'template_bahan_baku' => new ProductMaterialSheet($this),
            'produk' => new ProductRowSheet($this),
            'bahan_baku' => new ProductMaterialSheet($this),
        ];
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
                    $import->assertKnownSheetExists();
                }
            },
        ];
    }

    public function rules(): array
    {
        return [
            'kode_produk' => 'required|string|max:100',
            'nama_produk' => 'required|string|max:255',
            'kategori_level_1' => 'required|string|max:255',
            'kategori_level_2' => 'nullable|string|max:255',
            'kategori_level_3' => 'nullable|string|max:255',
            'kode_sku_varian' => 'required|string|max:100',
            'atribut_varian' => 'nullable|string',
            'harga' => 'nullable|numeric|min:0',
            'brand' => 'nullable|string|max:100',
            'deskripsi' => 'nullable|string',
            'aktif' => 'nullable|in:ya,tidak,true,false,1,0',
        ];
    }

    public function customValidation(array $row): array
    {
        return [];
    }

    /**
     * Kalau file tidak punya sheet yang dikenali (template_produk / template_bahan_baku /
     * produk / bahan_baku), semua baris akan diabaikan tanpa pesan apa pun. Beri error
     * supaya user tahu file-nya salah, bukan "import sukses 0 baris".
     */
    public function assertKnownSheetExists(): void
    {
        if (! $this->spreadsheet instanceof Spreadsheet) {
            return;
        }

        $titles = [];
        foreach ($this->spreadsheet->getAllSheets() as $sheet) {
            $titles[] = $sheet->getTitle();
        }

        if (array_intersect($titles, array_keys($this->sheets())) !== []) {
            return;
        }

        $this->recordError(1, 'Sheet "template_produk" tidak ditemukan. Unduh template produk lalu isi sheet tersebut, jangan mengganti nama sheet.');
    }

    public function importProductRows(Collection $rows): void    {
        $groups = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $data = $this->normalizeRow($row->toArray());

            if ($this->isEmptyRow($data)) {
                continue;
            }

            $code = trim((string) ($data['kode_produk'] ?? ''));
            if ($code === '') {
                $this->recordError($rowNumber, 'kode_produk wajib diisi.', $data);

                continue;
            }

            $groups[$code][] = ['row' => $rowNumber, 'data' => $data];
        }

        foreach ($groups as $items) {
            try {
                DB::transaction(function () use ($items): void {
                    foreach ($items as $item) {
                        try {
                            DB::transaction(fn () => $this->persistProductRow($item['data'], $item['row']));
                        } catch (Throwable $exception) {
                            $this->recordError($item['row'], $exception->getMessage(), $item['data']);
                        }
                    }
                });
            } catch (Throwable $exception) {
                foreach ($items as $item) {
                    $this->recordError($item['row'], $exception->getMessage(), $item['data']);
                }
            }
        }
    }

    public function importMaterialRows(Collection $rows): void
    {
        $grouped = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;
            $data = $this->normalizeRow($row->toArray());

            if (trim((string) ($data['kode_sku_varian'] ?? '')) === ''
                && trim((string) ($data['kode_bahan'] ?? '')) === ''
                && trim((string) ($data['qty_pakai'] ?? '')) === '') {
                continue;
            }

            $sku = trim((string) ($data['kode_sku_varian'] ?? ''));
            $materialCode = trim((string) ($data['kode_bahan'] ?? ''));
            $quantity = (float) ($data['qty_pakai'] ?? 0);

            if ($sku === '') {
                $this->recordError($rowNumber, 'kode_sku_varian wajib diisi.', $data);

                continue;
            }

            $variant = ProductVariantModel::query()
                ->whereRaw('LOWER(TRIM(sku)) = ?', [Str::lower($sku)])
                ->first();

            if (! $variant) {
                $this->recordError($rowNumber, "Kode SKU varian {$sku} tidak ditemukan.", $data);

                continue;
            }

            if ($materialCode === '') {
                $this->recordError($rowNumber, 'kode_bahan wajib diisi.', $data);

                continue;
            }

            $material = RawMaterialModel::query()
                ->whereRaw('LOWER(TRIM(code)) = ?', [Str::lower($materialCode)])
                ->first();

            if (! $material) {
                $this->recordError($rowNumber, "Kode bahan {$materialCode} tidak ditemukan.", $data);

                continue;
            }

            if ($quantity <= 0) {
                $this->recordError($rowNumber, 'qty_pakai harus lebih besar dari 0.', $data);

                continue;
            }

            $key = (int) $variant->id.':'.(int) $material->id;
            $alreadyGrouped = collect($grouped[(int) $variant->id] ?? [])->contains(
                fn (array $item): bool => $item['raw_material_id'] === (int) $material->id
            );

            if ($alreadyGrouped) {
                $this->recordError($rowNumber, "Bahan {$materialCode} duplikat untuk SKU {$sku}.", $data);

                continue;
            }

            $grouped[(int) $variant->id][] = [
                'row' => $rowNumber,
                'raw_material_id' => (int) $material->id,
                'quantity' => $quantity,
                'unit_cost' => max(0, (float) $material->average_cost),
                'data' => $data,
            ];
        }

        foreach ($grouped as $variantId => $materials) {
            try {
                DB::transaction(function () use ($variantId, $materials): void {
                    ProductVariantMaterialModel::query()->where('variant_id', $variantId)->delete();

                    $hpp = 0.0;
                    foreach ($materials as $material) {
                        $totalCost = $material['quantity'] * $material['unit_cost'];
                        $hpp += $totalCost;

                        ProductVariantMaterialModel::query()->create([
                            'variant_id' => $variantId,
                            'raw_material_id' => $material['raw_material_id'],
                            'quantity' => $material['quantity'],
                            'unit_cost' => $material['unit_cost'],
                            'total_cost' => $totalCost,
                        ]);
                    }

                    ProductVariantModel::query()->whereKey($variantId)->update([
                        'hpp' => $hpp,
                        'updated_at' => now(),
                    ]);
                });

                $this->importedCount += count($materials);
            } catch (Throwable $exception) {
                foreach ($materials as $material) {
                    $this->recordError($material['row'], $exception->getMessage(), $material['data']);
                }
            }
        }
    }

    private function persistProductRow(array $data, int $rowNumber): void
    {
        $code = trim((string) ($data['kode_produk'] ?? ''));
        $name = trim((string) ($data['nama_produk'] ?? ''));
        $sku = trim((string) ($data['kode_sku_varian'] ?? ''));

        if ($name === '') {
            throw new \InvalidArgumentException('nama_produk wajib diisi.');
        }

        $service = app(CategoryTreeService::class);
        $levels = $service->levelsFromRow($data);

        if ($levels[0] === '') {
            throw new \InvalidArgumentException('kategori_level_1 wajib diisi.');
        }

        if ($levels[2] !== '' && $levels[1] === '') {
            throw new \InvalidArgumentException('kategori_level_3 diisi tetapi kategori_level_2 kosong.');
        }

        $category = $service->findPath($levels);
        if (! $category) {
            $label = implode(' > ', array_filter($levels));
            throw new \InvalidArgumentException("Kombinasi kategori '{$label}' tidak ditemukan di database.");
        }

        $product = ProductModel::query()
            ->whereRaw('LOWER(TRIM(code)) = ?', [Str::lower($code)])
            ->first();

        $payload = [
            'code' => $code,
            'name' => $name,
            'brand' => $this->nullableString($data['brand'] ?? null),
            'description' => $this->nullableString($data['deskripsi'] ?? null),
            'is_active' => $this->parseBoolean($data['aktif'] ?? true),
            'primary_category_id' => $category->id,
            'updated_by' => auth()->id(),
        ];

        $duplicateName = ProductModel::query()
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower($name)])
            ->when($product, fn ($query) => $query->where('id', '!=', $product->id))
            ->exists();

        if ($duplicateName) {
            throw new \InvalidArgumentException("Nama produk '{$name}' sudah digunakan produk lain.");
        }

        if ($product) {
            $payload['slug'] = $this->uniqueSlug($name, (int) $product->id);
            $product->forceFill($payload)->save();
        } else {
            $payload['slug'] = $this->uniqueSlug($name);
            $payload['created_by'] = auth()->id();
            $product = ProductModel::query()->create($payload);
        }

        if ($this->extractImages) {
            $this->applyImage($rowNumber, $product);
        }

        $this->syncProductCategories($product, $category);

        if ($sku === '') {
            $sku = $this->generateSku($product, $data);
        }

        $variant = ProductVariantModel::query()
            ->whereRaw('LOWER(TRIM(sku)) = ?', [Str::lower($sku)])
            ->first();

        if ($variant && (int) $variant->product_id !== (int) $product->id) {
            throw new \InvalidArgumentException("SKU varian '{$sku}' sudah dipakai produk lain.");
        }

        $attributes = $this->parseAttributes($data['atribut_varian'] ?? '');
        $variantName = trim((string) ($data['nama_varian'] ?? ''));
        if ($variantName === '') {
            $variantName = $this->deriveVariantName($name, $attributes);
        }
        $variantName = $this->uniqueVariantName((int) $product->id, $variantName, $sku, $variant?->id);

        $isFirstVariant = ! ProductVariantModel::query()->where('product_id', $product->id)->exists();

        $variantPayload = [
            'product_id' => $product->id,
            'sku' => $sku,
            'name' => $variantName,
            'price' => max(0, (float) ($data['harga'] ?? 0)),
            'is_default' => $variant ? (bool) $variant->is_default : $isFirstVariant,
        ];

        if ($variant) {
            $variant->forceFill($variantPayload)->save();
        } else {
            $variant = ProductVariantModel::query()->create($variantPayload);
        }

        $this->syncVariantAttributes($variant, $attributes);

        $this->importedCount++;
    }

    private function recordError(int $rowNumber, string $message, array $data = []): void
    {
        $this->failedCount++;
        $this->errors[] = [
            'row' => $rowNumber,
            'data' => $data,
            'error' => "Baris {$rowNumber}: {$message}",
        ];
        Log::warning("Product import row {$rowNumber}: {$message}");
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
        foreach ($data as $value) {
            if (is_string($value) && trim($value) !== '') {
                return false;
            }
            if (is_numeric($value)) {
                return false;
            }
        }

        return true;
    }

    private function nullableString(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function parseBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return in_array(strtolower(trim((string) $value)), ['ya', 'true', '1', 'yes'], true);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'produk';
        $slug = $base;
        $suffix = 2;

        while (ProductModel::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function uniqueVariantName(int $productId, string $name, string $sku, ?int $ignoreId = null): string
    {
        $base = $name === '' ? $sku : $name;
        $candidate = $base;
        $suffix = 2;

        while (ProductVariantModel::query()
            ->where('product_id', $productId)
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower($candidate)])
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $candidate = $base.' - '.$sku.($suffix > 2 ? '-'.$suffix : '');
            $suffix++;
        }

        return $candidate;
    }

    /**
     * @return array<int, array{name: string, value: string}>
     */
    private function parseAttributes(mixed $raw): array
    {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return [];
        }

        $result = [];

        foreach (preg_split('/\s*,\s*/', $raw) ?: [] as $segment) {
            if (! str_contains($segment, ':')) {
                continue;
            }

            [$attribute, $value] = explode(':', $segment, 2);
            $attribute = strtolower(trim($attribute));
            $value = trim($value);

            if ($attribute === '' || $value === '') {
                continue;
            }

            $result[] = ['name' => $attribute, 'value' => $value];
        }

        return $result;
    }

    private function deriveVariantName(string $productName, array $attributes): string
    {
        $values = array_map(fn (array $attribute): string => $attribute['value'], $attributes);

        return $values === [] ? $productName : $productName.' - '.implode(' - ', $values);
    }

    private function syncVariantAttributes(ProductVariantModel $variant, array $attributes): void
    {
        ProductVariantValueModel::query()->where('variant_id', $variant->id)->delete();

        foreach ($attributes as $attributeData) {
            $attribute = $this->resolveAttribute($attributeData['name']);

            ProductVariantValueModel::query()->create([
                'variant_id' => $variant->id,
                'attribute_id' => $attribute->id,
                'value' => $attributeData['value'],
            ]);
        }
    }

    private function resolveAttribute(string $name): ProductAttributeModel
    {
        $attribute = ProductAttributeModel::query()
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower($name)])
            ->first();

        if ($attribute) {
            return $attribute;
        }

        $slug = Str::slug($name) ?: 'atribut';
        $candidate = $slug;
        $suffix = 2;

        while (ProductAttributeModel::query()->where('slug', $candidate)->exists()) {
            $candidate = $slug.'-'.$suffix;
            $suffix++;
        }

        return ProductAttributeModel::query()->create([
            'name' => $name,
            'slug' => $candidate,
            'type' => 'text',
        ]);
    }

    private function syncProductCategories(ProductModel $product, CategoryModel $category): void
    {
        $ids = [];
        $current = $category;

        while ($current) {
            array_unshift($ids, (int) $current->id);
            $current = $current->parent;
        }

        DB::table('product_categories')->where('product_id', $product->id)->delete();

        foreach (array_unique($ids) as $categoryId) {
            DB::table('product_categories')->insert([
                'product_id' => $product->id,
                'category_id' => $categoryId,
                'is_primary' => $categoryId === (int) $category->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function generateSku(ProductModel $product, array $data): string
    {
        $context = [
            'name' => (string) $product->name,
            'brand' => (string) ($product->brand ?? ''),
            'category' => 'CAT'.$product->primary_category_id,
            'attr' => str_replace(', ', '-', (string) ($data['atribut_varian'] ?? '')),
            'type' => 'SKU',
            'seq' => (int) DB::table('product_variants')->count() + 1,
        ];

        return app(CodePatternService::class)->unique(
            'sku',
            $context,
            fn (string $sku): bool => DB::table('product_variants')->whereRaw('LOWER(TRIM(sku)) = ?', [Str::lower($sku)])->exists()
        );
    }

    private function applyImage(int $rowNumber, ProductModel $product): void
    {
        if (! $this->spreadsheet) {
            return;
        }

        $sheet = $this->spreadsheet->getSheetByName('template_produk')
            ?? $this->spreadsheet->getSheetByName('produk')
            ?? $this->spreadsheet->getSheet(0);

        $coordinate = $this->getColumnLetter($this->imageColumnIndex).($rowNumber + 1);

        foreach ($sheet->getDrawingCollection() as $drawing) {
            if ($drawing->getCoordinates() !== $coordinate) {
                continue;
            }

            $path = $this->saveDrawing($drawing, $rowNumber);
            if ($path) {
                $product->forceFill(['thumbnail' => $path])->save();
            }

            return;
        }
    }

    private function saveDrawing($drawing, int $rowNumber): ?string
    {
        try {
            $extension = $this->getExtension($drawing);
            $filename = 'product_import_'.$rowNumber.'_'.time().'.'.$extension;
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
            Log::warning("Failed to save product image for row {$rowNumber}: ".$exception->getMessage());
        }

        return null;
    }

    private function getExtension($drawing): string
    {
        if ($drawing instanceof MemoryDrawing) {
            return 'png';
        }

        $path = $drawing->getPath();

        return $path ? (pathinfo($path, PATHINFO_EXTENSION) ?: 'png') : 'png';
    }

    private function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index >= 0) {
            $letter = chr(65 + ($index % 26)).$letter;
            $index = intdiv($index, 26) - 1;
        }

        return $letter;
    }
}
