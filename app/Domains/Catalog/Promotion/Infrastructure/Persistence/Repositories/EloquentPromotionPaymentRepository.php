<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionPaymentRepositoryInterface;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentPromotionPaymentRepository implements PromotionPaymentRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return PromotionPaymentModel::query()
            ->with(['store:id,name', 'user:id,name,email', 'reviewer:id,name,email', 'promotion:id,promotion_payment_id,name'])
            ->when($storeId !== null, fn (Builder $query) => $query->where('store_id', $storeId))
            ->when(! empty($filters['status']), fn (Builder $query) => $query->where('status', $filters['status']))
            ->when(isset($filters['available']) && filter_var($filters['available'], FILTER_VALIDATE_BOOLEAN), fn (Builder $query) => $query->where('status', 'approved')->whereDoesntHave('promotion'))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('payment_number', 'like', "%{$search}%")
                        ->orWhere('package_name', 'like', "%{$search}%")
                        ->orWhereHas('store', fn (Builder $storeQuery) => $storeQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest('paid_at')
            ->latest('id')
            ->paginate($perPage);
    }

    public function find(int $id, ?int $storeId = null): ?PromotionPaymentModel
    {
        return PromotionPaymentModel::query()
            ->with(['store:id,name', 'user:id,name,email', 'reviewer:id,name,email', 'promotion:id,promotion_payment_id,name'])
            ->when($storeId !== null, fn (Builder $query) => $query->where('store_id', $storeId))
            ->find($id);
    }

    public function save(PromotionPaymentModel $model): PromotionPaymentModel
    {
        $model->save();

        return $model->refresh()->load(['store:id,name', 'user:id,name,email', 'reviewer:id,name,email', 'promotion:id,promotion_payment_id,name']);
    }

    public function approvedAvailable(int $id, int $storeId, ?int $promotionId = null): ?PromotionPaymentModel
    {
        return PromotionPaymentModel::query()
            ->whereKey($id)
            ->where('store_id', $storeId)
            ->where('status', 'approved')
            ->where('is_active', true)
            ->where(function (Builder $query) use ($promotionId): void {
                $query->whereDoesntHave('promotion')
                    ->when($promotionId !== null, fn (Builder $query) => $query->orWhereHas('promotion', fn (Builder $promotionQuery) => $promotionQuery->whereKey($promotionId)));
            })
            ->first();
    }
}
