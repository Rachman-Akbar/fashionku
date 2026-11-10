<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Queries;

use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;
use Illuminate\Support\Collection;

final class GetHeaderMenuQuery
{
    public function __construct(
        private readonly CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(): Collection
    {
        return $this->repository->getAll();
    }
}
