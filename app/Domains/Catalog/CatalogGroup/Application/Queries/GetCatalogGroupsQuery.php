<?php

namespace App\Domains\Catalog\CatalogGroup\Application\Queries;

use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;

final class GetCatalogGroupsQuery
{
    public function __construct(
        private CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(array $filters = [], bool $includeInactive = false)
    {
        return $this->repository->getAll($filters, $includeInactive);
    }
}
