<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Queries;

use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;

final class GetHeaderMenuQuery
{
    public function __construct(
        private readonly CategoryRepositoryInterface $repository
    ) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function execute(): array
    {
        return $this->repository->listTree();
    }
}