<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\Readers;

use App\Domains\Order\Cart\Domain\ValueObjects\VariantDetails;

interface ProductForCartReaderInterface
{
    /**
     * Mengambil sisa stok dari variant_id tertentu.
     */
    public function getVariantStock(int $productVariantId): ?int;

    /**
     * Mengambil detail informasi varian produk beserta harga dan SKU.
     */
    public function getVariantDetails(int $productVariantId): ?VariantDetails;

    /**
     * Mengambil detail banyak varian sekaligus, keyed by variant id.
     *
     * @param  array<int>  $productVariantIds
     * @return array<int, VariantDetails>
     */
    public function getVariantsDetails(array $productVariantIds): array;
}
