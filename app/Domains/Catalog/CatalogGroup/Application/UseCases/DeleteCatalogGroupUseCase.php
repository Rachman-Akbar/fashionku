<?php

namespace App\Domains\Catalog\CatalogGroup\Application\UseCases;

use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;

final class DeleteCatalogGroupUseCase
{
    public function __construct(
        private CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(int $id): bool
    {
        $catalogGroup = $this->repository->findById($id);

        if (! $catalogGroup) {
            return false;
        }

        return $this->repository->delete($id);
    }
}
