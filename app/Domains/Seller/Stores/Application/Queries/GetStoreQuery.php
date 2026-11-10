<?php

namespace App\Domains\Seller\Stores\Application\Queries;

use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;

final class GetStoreQuery
{
    public function __construct(
        private StoreRepositoryInterface $repository
    ) {}

    public function execute(array $filters = [], int $perPage = 15)
    {
        return $this->repository->paginate($filters, $perPage);
    }
}
