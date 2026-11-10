<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Queries;

use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;

final class ListCategoryMenuQuery
{
    public function __construct(
        private CategoryRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        return $this->repository->listMenuTree();
    }
}
