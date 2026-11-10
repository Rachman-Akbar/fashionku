<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Infrastructure\Persistence\Repositories;

use App\Domains\Finance\Commission\Domain\Entities\SellerWithdrawal;
use App\Domains\Finance\Commission\Domain\Repositories\SellerWithdrawalRepositoryInterface;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Models\SellerWithdrawalModel;
use Illuminate\Support\Str;

class EloquentSellerWithdrawalRepository implements SellerWithdrawalRepositoryInterface
{
    public function findById(int $id): ?SellerWithdrawal
    {
        $model = SellerWithdrawalModel::find($id);

        return $model ? $this->toEntity($model) : null;
    }

    public function create(array $data): SellerWithdrawal
    {
        if (empty($data['withdrawal_number'])) {
            $data['withdrawal_number'] = 'WD-'.strtoupper(Str::random(10));
        }

        $model = SellerWithdrawalModel::create($data);

        return $this->toEntity($model);
    }

    public function update(int $id, array $data): SellerWithdrawal
    {
        $model = SellerWithdrawalModel::findOrFail($id);
        $model->update($data);

        return $this->toEntity($model->fresh());
    }

    public function getByStore(int $storeId, array $filters = [], int $perPage = 20): mixed
    {
        $query = SellerWithdrawalModel::where('store_id', $storeId);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getPendingByStore(int $storeId): mixed
    {
        return SellerWithdrawalModel::where('store_id', $storeId)
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getAll(array $filters = [], int $perPage = 20): mixed
    {
        $query = SellerWithdrawalModel::with(['store' => fn ($q) => $q->select('id', 'name', 'slug')]);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['store_id'])) {
            $query->where('store_id', $filters['store_id']);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getTotalWithdrawn(int $storeId): float
    {
        return (float) SellerWithdrawalModel::where('store_id', $storeId)
            ->whereIn('status', ['approved', 'completed'])
            ->sum('amount');
    }

    public function getPendingCount(): int
    {
        return (int) SellerWithdrawalModel::where('status', 'pending')->count();
    }

    private function toEntity(SellerWithdrawalModel $model): SellerWithdrawal
    {
        return new SellerWithdrawal(
            id: $model->id,
            storeId: $model->store_id,
            userId: $model->user_id,
            withdrawalNumber: $model->withdrawal_number,
            amount: (float) $model->amount,
            method: $model->method,
            bankDetails: $model->bank_details,
            status: $model->status,
            rejectionReason: $model->rejection_reason,
            processedAt: $model->processed_at?->toDateTimeString(),
            processedBy: $model->processed_by,
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString(),
        );
    }
}
