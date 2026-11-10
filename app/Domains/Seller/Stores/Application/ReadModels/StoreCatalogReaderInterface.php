<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\ReadModels;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StoreCatalogReaderInterface
{
    /**
     * Mengambil data toko berpaginasi dengan filter tertentu.
     */
    public function paginatedStores(array $filters = []): LengthAwarePaginator;

    /**
     * Mengambil detail profil toko tunggal berdasarkan slug.
     */
    public function storeProfileBySlug(string $slug): ?object;
}
