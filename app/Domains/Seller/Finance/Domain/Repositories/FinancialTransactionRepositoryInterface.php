<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Domain\Repositories;

use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface FinancialTransactionRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator;

    public function find(int $id, ?int $storeId): ?FinancialTransactionModel;

    public function save(FinancialTransactionModel $model): FinancialTransactionModel;

    public function delete(FinancialTransactionModel $model): bool;
}
