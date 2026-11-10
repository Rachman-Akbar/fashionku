<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\ProductImage;
use App\Domains\Catalog\Product\Domain\Repositories\ProductImageRepositoryInterface;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Mappers\ProductImageMapper;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductImageModel;

final class EloquentProductImageRepository implements ProductImageRepositoryInterface
{
    public function findById(int $id): ?ProductImage
    {
        $model = ProductImageModel::find($id);

        return $model ? ProductImageMapper::toEntity($model) : null;
    }

    /**
     * @return ProductImage[]
     */
    public function findByProductId(int $productId): array
    {
        return ProductImageModel::where('product_id', $productId)
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(fn (ProductImageModel $model) => ProductImageMapper::toEntity($model))
            ->toArray();
    }

    public function save(ProductImage $image): ProductImage
    {
        $model = ProductImageModel::updateOrCreate(
            ['id' => $image->id()],
            [
                'product_id' => $image->productId(),
                'url' => $image->url(),
                'alt_text' => $image->altText(),
                'is_primary' => $image->isPrimary(),
                'sort_order' => $image->sortOrder(),
            ]
        );

        return ProductImageMapper::toEntity($model);
    }

    public function delete(int $id): bool
    {
        $model = ProductImageModel::find($id);

        if (! $model) {
            return false;
        }

        return (bool) $model->delete();
    }

    public function replaceForProduct(int $productId, array $images): void
    {
        // 1. Hapus foto lama agar tidak menumpuk sampah data jika ada update mengganti foto
        ProductImageModel::where('product_id', $productId)->delete();

        // 2. Jika array image kosong (misal semua foto dihapus), langsung berhenti
        if (empty($images)) {
            return;
        }

        // 3. Masukkan data foto yang baru
        foreach ($images as $image) {
            ProductImageModel::create([
                'product_id' => $productId,
                'url' => (string) $image['url'],
                'alt_text' => $image['alt_text'] ?? null,
                'is_primary' => (bool) ($image['is_primary'] ?? false),
                'sort_order' => (int) ($image['sort_order'] ?? 0),
            ]);
        }
    }
}
