<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Domain\Repositories;

use App\Domains\Finance\Commission\Domain\Entities\SellerSettlement;

interface SellerSettlementRepositoryInterface
{
    public function findById(int $id): ?SellerSettlement;

    public function findByOrderAndSubOrder(int $orderId, ?int $subOrderId): ?SellerSettlement;

    public function create(array $data): SellerSettlement;

    public function update(int $id, array $data): SellerSettlement;

    public function getByStore(int $storeId, array $filters = [], int $perPage = 20): mixed;

    public function getTotalByStore(int $storeId, string $status = 'settled'): float;

    public function settlePending(int $storeId): float;
}
