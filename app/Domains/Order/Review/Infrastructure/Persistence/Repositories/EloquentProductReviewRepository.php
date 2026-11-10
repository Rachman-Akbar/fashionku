<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Review\Domain\Repositories\ProductReviewRepositoryInterface;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentProductReviewRepository implements ProductReviewRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?string $userId, ?int $storeId): LengthAwarePaginator
    {
        return ProductReviewModel::query()
            ->with(['product:id,store_id,name,slug,thumbnail', 'user:id,name,avatar', 'order:id,order_number'])
            ->when($userId !== null, fn (Builder $query) => $query->where('user_id', $userId))
            ->when($storeId !== null, fn (Builder $query) => $query->whereHas('product', fn (Builder $productQuery) => $productQuery->where('store_id', $storeId)))
            ->when(! empty($filters['product_id']), fn (Builder $query) => $query->where('product_id', (int) $filters['product_id']))
            ->when(! empty($filters['rating']), fn (Builder $query) => $query->where('rating', (int) $filters['rating']))
            ->when(isset($filters['is_active']), fn (Builder $query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('review', 'like', "%{$search}%")
                        ->orWhereHas('product', fn (Builder $productQuery) => $productQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest('id')
            ->paginate($perPage);
    }

    public function find(int $id): ?ProductReviewModel
    {
        return ProductReviewModel::query()->with(['product', 'user:id,name,avatar', 'order:id,order_number'])->find($id);
    }

    public function save(ProductReviewModel $model): ProductReviewModel
    {
        $model->save();

        return $model->refresh()->load(['product:id,store_id,name,slug,thumbnail', 'user:id,name,avatar', 'order:id,order_number']);
    }

    public function delete(ProductReviewModel $model): bool
    {
        return (bool) $model->delete();
    }
}
