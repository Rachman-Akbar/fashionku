<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Queries;

use App\Domains\Catalog\Category\Domain\Entities\Category;
use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;

final class GetCategoryByPathQuery
{
    public function __construct(
        private CategoryRepositoryInterface $repository
    ) {}

    public function execute(string $path): ?Category
    {
        return $this->repository->findByFullSlug($path);
    }
}
