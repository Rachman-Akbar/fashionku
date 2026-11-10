<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\Queries;

use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class ListStoreQuery
{
    public function __construct(
        private StoreRepositoryInterface $repository
    ) {}

    public function execute(array $filters): LengthAwarePaginator
    {
        return $this->repository->paginate($filters);
    }
}
