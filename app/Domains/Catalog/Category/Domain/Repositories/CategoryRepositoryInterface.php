<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Domain\Repositories;

use App\Domains\Catalog\Category\Domain\Entities\Category;

interface CategoryRepositoryInterface
{
    public function findById(int $id, bool $includeInactive = false): ?Category;

    public function findBySlug(string $slug, bool $includeInactive = false): ?Category;

    public function findByPath(string $path, bool $includeInactive = false): ?Category;

    public function findByFullSlug(string $fullSlug, bool $includeInactive = false): ?Category;

    public function listTree(bool $includeInactive = false): array;

    public function listMenuTree(): array;

    public function findChildrenByParentId(int $parentId, bool $includeInactive = true): array;

    public function isDescendantOf(int $categoryId, int $possibleDescendantId): bool;

    public function maxDepthFrom(int $categoryId): int;

    public function nameExistsInParent(
        int $catalogGroupId,
        ?int $parentId,
        string $name,
        ?int $ignoreId = null
    ): bool;

    public function save(Category $category): Category;

    public function delete(int $id): bool;
}
