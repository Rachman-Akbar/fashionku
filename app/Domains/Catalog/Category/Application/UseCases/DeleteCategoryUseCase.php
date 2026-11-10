<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\UseCases;

use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;

final class DeleteCategoryUseCase
{
    public function __construct(
        private CategoryRepositoryInterface $repository
    ) {}

    public function execute(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
