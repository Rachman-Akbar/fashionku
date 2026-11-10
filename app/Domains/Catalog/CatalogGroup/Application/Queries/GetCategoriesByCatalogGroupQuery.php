<?php

namespace App\Domains\Catalog\CatalogGroup\Application\Queries;

use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;
use Illuminate\Support\Collection;

class GetCategoriesByCatalogGroupQuery
{
    public function __construct(
        private readonly CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(int $catalogGroupId): Collection
    {
        return $this->repository->getCategoriesByGroupId($catalogGroupId);
    }
}
