<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Application\Services;

use App\Domains\Finance\Commission\Domain\Entities\SellerSettlement;
use App\Domains\Finance\Commission\Domain\Repositories\SellerSettlementRepositoryInterface;

class SellerSettlementService
{
    public function __construct(
        private SellerSettlementRepositoryInterface $repository
    ) {}

    public function createSettlement(array $data): SellerSettlement
    {
        return $this->repository->create($data);
    }

    public function findByOrderAndSubOrder(int $orderId, ?int $subOrderId): ?SellerSettlement
    {
        return $this->repository->findByOrderAndSubOrder($orderId, $subOrderId);
    }

    public function getStoreSettlements(int $storeId, array $filters = [], int $perPage = 20): mixed
    {
        return $this->repository->getByStore($storeId, $filters, $perPage);
    }

    public function getStoreBalance(int $storeId): float
    {
        return $this->repository->getTotalByStore($storeId, 'settled');
    }

    public function settlePendingSettlements(int $storeId): float
    {
        return $this->repository->settlePending($storeId);
    }

    public function getById(int $id): ?SellerSettlement
    {
        return $this->repository->findById($id);
    }
}
