<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\ProductAttribute;

use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeRepositoryInterface;

final class ListProductAttributesQuery
{
    public function __construct(
        private readonly ProductAttributeRepositoryInterface $repository
    ) {}

    public function execute(array $filters = [])
    {
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $this->repository->paginate($perPage);
    }
}
