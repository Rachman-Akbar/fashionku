<?php

declare(strict_types=1);

namespace App\Domains\Catalog\CatalogGroup\Domain\Repositories;

use App\Domains\Catalog\CatalogGroup\Domain\Entities\CatalogGroup;
use Illuminate\Support\Collection;

interface CatalogGroupRepositoryInterface
{
    public function getAll(array $filters = [], bool $includeInactive = false): Collection;

    public function findById(int $id, bool $includeInactive = false): ?CatalogGroup;

    public function findBySlug(string $slug, bool $includeInactive = false): ?CatalogGroup;

    public function getCategoriesByGroupId(int $groupId): Collection;

    public function nameExists(string $name, ?int $ignoreId = null): bool;

    public function save(CatalogGroup $catalogGroup): CatalogGroup;

    public function delete(int $id): bool;

    public function clearCache(): void;
}
