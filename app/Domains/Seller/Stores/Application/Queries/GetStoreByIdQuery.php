<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\Queries;

use App\Domains\Seller\Stores\Domain\Entities\Store as StoreEntity;
use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;

final class GetStoreByIdQuery
{
    private StoreRepositoryInterface $storeRepository;

    public function __construct(StoreRepositoryInterface $storeRepository)
    {
        $this->storeRepository = $storeRepository;
    }

    public function execute(int $id): ?StoreEntity
    {
        return $this->storeRepository->findById($id);
    }
}
