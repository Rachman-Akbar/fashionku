<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Queries;

use App\Domains\Catalog\Category\Domain\Entities\Category;
use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;

final class GetCategoryByIdQuery
{
    public function __construct(
        private readonly CategoryRepositoryInterface $repository
    ) {}

    public function execute(int $id, bool $includeInactive = false): ?Category
    {
        return $this->repository->findById($id, $includeInactive);
    }
}
