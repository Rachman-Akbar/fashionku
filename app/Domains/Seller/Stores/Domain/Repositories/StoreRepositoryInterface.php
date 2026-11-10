<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Domain\Repositories;

use App\Domains\Seller\Stores\Domain\Entities\Store;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\CursorPaginator;

interface StoreRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 8): LengthAwarePaginator;

    public function findBySlug(string $slug, bool $publicOnly = false): ?Store;

    public function listProductsByStoreSlug(string $slug, array $filters = []): CursorPaginator;

    public function findById(int $id): ?Store;

    public function create(Store $store): Store;

    public function update(Store $store, ?array $detailData = null): Store;
}
