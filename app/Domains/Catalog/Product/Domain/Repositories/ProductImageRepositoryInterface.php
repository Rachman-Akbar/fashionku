<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\ProductImage;

interface ProductImageRepositoryInterface
{
    /**
     * Mencari satu gambar berdasarkan ID uniknya.
     */
    public function findById(int $id): ?ProductImage;

    /**
     * Mengambil semua galeri foto berdasarkan ID Produk.
     *
     * * @return ProductImage[]
     */
    public function findByProductId(int $productId): array;

    /**
     * Menyimpan atau memperbarui satu entitas gambar produk.
     */
    public function save(ProductImage $image): ProductImage;

    /**
     * Menghapus foto produk berdasarkan ID gambarnya.
     */
    public function delete(int $id): bool;

    /**
     * Fitur khusus mass-update (mengganti total isi galeri foto produk).
     * Digunakan langsung di dalam Create/Update Use Case.
     */
    public function replaceForProduct(int $productId, array $images): void;
}
