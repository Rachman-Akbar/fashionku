<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Domain\Repositories;

use App\Domains\Finance\Commission\Domain\Entities\SellerWithdrawal;

interface SellerWithdrawalRepositoryInterface
{
    public function findById(int $id): ?SellerWithdrawal;

    public function create(array $data): SellerWithdrawal;

    public function update(int $id, array $data): SellerWithdrawal;

    public function getByStore(int $storeId, array $filters = [], int $perPage = 20): mixed;

    public function getPendingByStore(int $storeId): mixed;

    public function getAll(array $filters = [], int $perPage = 20): mixed;

    public function getTotalWithdrawn(int $storeId): float;

    public function getPendingCount(): int;
}
