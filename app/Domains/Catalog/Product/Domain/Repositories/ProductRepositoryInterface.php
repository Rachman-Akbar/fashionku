<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Domain\Repositories;

use App\Domains\Catalog\Product\Domain\Entities\Product;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    public function getAll(array $filters = []): Collection;

    public function cursorPaginate(array $filters = [], int $perPage = 24): CursorPaginator;

    public function paginate(array $filters = [], int $perPage = 20, int $page = 1): LengthAwarePaginator;

    public function facets(array $filters = []): array;

    public function findById(int $id, bool $includeInactive = false): ?Product;

    public function findBySlug(string $slug, bool $includeInactive = false): ?Product;

    public function nameExistsForStore(string $name, int $storeId, ?int $ignoreId = null): bool;

    public function findPublishedByStoreId(int $storeId): Collection;

    public function findPublishedByCategorySlug(
        string $categorySlug,
        array $filters = []
    ): Collection;

    public function findPublishedByCategoryPath(
        string $path,
        array $filters,
        bool $includeDescendants
    ): Collection;

    public function findByCategory(
        int $categoryId,
        array $filters,
        bool $includeDescendants
    ): Collection;

    public function save(Product $product): Product;

    public function delete(int $id): bool;
}
