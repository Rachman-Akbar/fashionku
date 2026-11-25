<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Review\Domain\Repositories\ProductReviewRepositoryInterface;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentProductReviewRepository implements ProductReviewRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?string $userId): LengthAwarePaginator
    {
        return ProductReviewModel::query()
            ->with(['product:id,name,slug,thumbnail', 'user:id,name,avatar', 'order:id,order_number', 'creator:id,name', 'updater:id,name'])
            ->when($userId !== null, fn (Builder $query) => $query->where('user_id', $userId))
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

    public function summary(int $productId): array
    {
        $reviews = ProductReviewModel::query()
            ->where('product_id', $productId)
            ->where('is_active', true)
            ->selectRaw('
                COUNT(*) as total,
                COALESCE(AVG(rating), 0) as average,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1
            ')
            ->first();

        return [
            'total' => (int) $reviews->total,
            'average' => round((float) $reviews->average, 1),
            'distribution' => [
                5 => (int) $reviews->rating_5,
                4 => (int) $reviews->rating_4,
                3 => (int) $reviews->rating_3,
                2 => (int) $reviews->rating_2,
                1 => (int) $reviews->rating_1,
            ],
        ];
    }

    public function find(int $id): ?ProductReviewModel
    {
        return ProductReviewModel::query()->with(['product', 'user:id,name,avatar', 'order:id,order_number', 'creator:id,name', 'updater:id,name'])->find($id);
    }

    public function save(ProductReviewModel $model): ProductReviewModel
    {
        $model->save();

        return $model->refresh()->load(['product:id,name,slug,thumbnail', 'user:id,name,avatar', 'order:id,order_number', 'creator:id,name', 'updater:id,name']);
    }

    public function delete(ProductReviewModel $model): bool
    {
        return (bool) $model->delete();
    }
}
