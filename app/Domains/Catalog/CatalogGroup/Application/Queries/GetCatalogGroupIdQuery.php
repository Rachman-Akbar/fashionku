<?php

namespace App\Domains\Catalog\CatalogGroup\Application\Queries;

use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;

final class GetCatalogGroupIdQuery
{
    public function __construct(
        private CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(int $id, bool $includeInactive = false)
    {
        return $this->repository->findById($id, $includeInactive);
    }
}
