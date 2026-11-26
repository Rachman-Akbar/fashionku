<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Excel;

use App\Domains\Catalog\Category\Application\Services\CategoryTreeService;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;

class ProductExport implements Export, WithMultipleSheets
{
    public function __construct(protected ?Collection $products = null) {}

    public function sheets(): array
    {
        $products = $this->products ?? ProductModel::query()
            ->with(['primaryCategory.parent.parent', 'variants.values.attribute'])
            ->orderBy('name')
            ->get();

        return [
            'produk' => new ProductMainExportSheet($products),
            'bahan_baku' => new ProductMaterialExportSheet($products),
        ];
    }
}

final class ProductMainExportSheet extends BaseExport implements WithTitle
{
    public function title(): string
    {
        return 'produk';
    }

    protected int $imageColumnIndex = 1;

    protected string $imagePathColumn = 'thumbnail';

    protected int $imageWidth = 80;

    protected int $imageHeight = 80;

    public function __construct(private Collection $products) {}

    public function collection(): Collection
    {
        $rows = collect();
        $service = app(CategoryTreeService::class);

        foreach ($this->products as $product) {
            $path = $product->primaryCategory
                ? $service->path($product->primaryCategory)
                : [];

            $variants = $product->variants->isNotEmpty() ? $product->variants : collect([null]);

            foreach ($variants as $variant) {
                $attributes = collect($variant?->values ?? [])
                    ->map(fn ($value): string => Str::lower(trim((string) $value->attribute?->name)).':'.trim((string) $value->value))
                    ->implode(', ');

                $rows->push([
                    'code' => $product->code ?? '',
                    'thumbnail' => $product->thumbnail ?? '',
                    'name' => $product->name ?? '',
                    'kategori_level_1' => Str::lower(trim((string) ($path[0] ?? ''))),
                    'kategori_level_2' => Str::lower(trim((string) ($path[1] ?? ''))),
                    'kategori_level_3' => Str::lower(trim((string) ($path[2] ?? ''))),
                    'sku' => $variant?->sku ?? '',
                    'attributes' => $attributes,
                    'price' => $variant?->price ?? 0,
                    'brand' => $product->brand ?? '',
                    'description' => $product->description ?? '',
                    'active' => $product->is_active ? 'ya' : 'tidak',
                ]);
            }
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'kode_produk',
            'gambar',
            'nama_produk',
            'kategori_level_1',
            'kategori_level_2',
            'kategori_level_3',
            'kode_sku_varian',
            'atribut_varian',
            'harga',
            'brand',
            'deskripsi',
            'aktif',
        ];
    }

    public function map($row): array
    {
        return [
            $row['code'],
            $row['thumbnail'],
            $row['name'],
            $row['kategori_level_1'],
            $row['kategori_level_2'],
            $row['kategori_level_3'],
            $row['sku'],
            $row['attributes'],
            $row['price'],
            $row['brand'],
            $row['description'],
            $row['active'],
        ];
    }
}

final class ProductMaterialExportSheet extends BaseExport implements WithTitle
{
    public function title(): string
    {
        return 'bahan_baku';
    }

    public function __construct(private Collection $products) {}

    public function collection(): Collection
    {
        $rows = collect();
        $productIds = $this->products->pluck('id')->filter()->values();

        // Tabel `product_variant_materials` tidak ada di skema; bahan baku
        // disimpan di `product_materials` (per produk). SKU varian diambil
        // dari varian default produk.
        if ($productIds->isEmpty()) {
            return $rows;
        }

        $materials = DB::table('product_materials')
            ->join('raw_materials', 'raw_materials.id', '=', 'product_materials.raw_material_id')
            ->join('product_variants', 'product_variants.product_id', '=', 'product_materials.product_id')
            ->whereIn('product_materials.product_id', $productIds)
            ->where('product_variants.is_default', true)
            ->select(
                'product_variants.sku as variant_sku',
                'raw_materials.code as material_code',
                'product_materials.quantity'
            )
            ->get();

        foreach ($materials as $material) {
            $rows->push([
                'sku' => $material->variant_sku,
                'material' => $material->material_code,
                'quantity' => (float) $material->quantity,
            ]);
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['kode_sku_varian', 'kode_bahan', 'qty_pakai'];
    }

    public function map($row): array
    {
        return [$row['sku'], $row['material'], $row['quantity']];
    }
}
