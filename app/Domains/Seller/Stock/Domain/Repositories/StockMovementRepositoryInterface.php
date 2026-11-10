<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Domain\Repositories;

use App\Domains\Seller\Stock\Infrastructure\Persistence\Models\StockMovementModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StockMovementRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator;

    public function save(StockMovementModel $model): StockMovementModel;

    public function existsForOrderItem(int $orderItemId, string $movementKey): bool;
}
