<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Infrastructure\Persistence\Repositories;

use App\Domains\Seller\Stock\Domain\Repositories\StockMovementRepositoryInterface;
use App\Domains\Seller\Stock\Infrastructure\Persistence\Models\StockMovementModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentStockMovementRepository implements StockMovementRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return StockMovementModel::query()
            ->with(['store:id,name', 'product:id,name', 'variant:id,name,sku,stock', 'order:id,order_number'])
            ->when($storeId !== null, fn (Builder $query) => $query->where('store_id', $storeId))
            ->when(! empty($filters['type']), fn (Builder $query) => $query->where('type', $filters['type']))
            ->when(! empty($filters['product_id']), fn (Builder $query) => $query->where('product_id', (int) $filters['product_id']))
            ->when(! empty($filters['variant_id']), fn (Builder $query) => $query->where('variant_id', (int) $filters['variant_id']))
            ->when(! empty($filters['date_from']), fn (Builder $query) => $query->whereDate('occurred_at', '>=', $filters['date_from']))
            ->when(! empty($filters['date_to']), fn (Builder $query) => $query->whereDate('occurred_at', '<=', $filters['date_to']))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('reference_id', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%")
                        ->orWhereHas('product', fn (Builder $productQuery) => $productQuery->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('variant', fn (Builder $variantQuery) => $variantQuery->where('sku', 'like', "%{$search}%"));
                });
            })
            ->latest('occurred_at')
            ->latest('id')
            ->paginate($perPage);
    }

    public function save(StockMovementModel $model): StockMovementModel
    {
        $model->save();

        return $model->refresh()->load(['store:id,name', 'product:id,name', 'variant:id,name,sku,stock', 'order:id,order_number']);
    }

    public function existsForOrderItem(int $orderItemId, string $movementKey): bool
    {
        return StockMovementModel::query()
            ->where('order_item_id', $orderItemId)
            ->where('movement_key', $movementKey)
            ->exists();
    }
}
