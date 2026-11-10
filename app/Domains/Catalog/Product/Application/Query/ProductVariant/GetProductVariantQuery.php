<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\ProductVariant;

use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;

final class GetProductVariantQuery
{
    public function __construct(
        private readonly ProductVariantRepositoryInterface $repository
    ) {}

    public function execute(int $id)
    {
        return $this->repository->findById($id);
    }
}
