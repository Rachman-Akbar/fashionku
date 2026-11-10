<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Policies;

use App\Domains\Catalog\Category\Domain\Entities\Category;
use InvalidArgumentException;

final class CategoryHierarchyPolicy
{
    private const MAX_LEVEL = 3;

    public function assertCanCreate(?Category $parent): void
    {
        if ($parent && $parent->level() >= self::MAX_LEVEL) {
            throw new InvalidArgumentException('Kategori hanya boleh sampai level 3.');
        }
    }

    public function assertCanMove(Category $category, ?Category $parent, int $subtreeDepth): void
    {
        $newLevel = $parent ? $parent->level() + 1 : 1;
        $newDeepestLevel = $newLevel + $subtreeDepth - 1;

        if ($newDeepestLevel > self::MAX_LEVEL) {
            throw new InvalidArgumentException('Perpindahan kategori membuat struktur melebihi level 3.');
        }
    }
}
