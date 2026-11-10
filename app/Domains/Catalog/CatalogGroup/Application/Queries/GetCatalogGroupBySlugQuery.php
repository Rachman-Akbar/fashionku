<?php

namespace App\Domains\Catalog\CatalogGroup\Application\Queries;

use App\Domains\Catalog\CatalogGroup\Domain\Entities\CatalogGroup;
use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;

final class GetCatalogGroupBySlugQuery
{
    public function __construct(
        private CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(string $slug): ?CatalogGroup
    {
        return $this->repository->findBySlug($slug);
    }
}
