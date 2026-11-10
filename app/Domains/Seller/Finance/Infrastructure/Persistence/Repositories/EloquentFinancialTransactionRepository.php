<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Infrastructure\Persistence\Repositories;

use App\Domains\Seller\Finance\Domain\Repositories\FinancialTransactionRepositoryInterface;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentFinancialTransactionRepository implements FinancialTransactionRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return FinancialTransactionModel::query()
            ->with(['store:id,name', 'order:id,order_number', 'counterparty:id,name,email'])
            ->when($storeId !== null, fn (Builder $query) => $query->where('store_id', $storeId))
            ->when(! empty($filters['type']), fn (Builder $query) => $query->whereIn('type', collect(explode(',', (string) $filters['type']))->map(fn (string $type): string => trim($type))->filter()->values()->all()))
            ->when(! empty($filters['status']), fn (Builder $query) => $query->where('status', $filters['status']))
            ->when(isset($filters['is_active']), fn (Builder $query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)))
            ->when(! empty($filters['date_from']), fn (Builder $query) => $query->whereDate('occurred_at', '>=', $filters['date_from']))
            ->when(! empty($filters['date_to']), fn (Builder $query) => $query->whereDate('occurred_at', '<=', $filters['date_to']))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('reference_number', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest('occurred_at')
            ->latest('id')
            ->paginate($perPage);
    }

    public function find(int $id, ?int $storeId): ?FinancialTransactionModel
    {
        return FinancialTransactionModel::query()
            ->with(['store:id,name', 'order:id,order_number', 'counterparty:id,name,email'])
            ->when($storeId !== null, fn (Builder $query) => $query->where('store_id', $storeId))
            ->find($id);
    }

    public function save(FinancialTransactionModel $model): FinancialTransactionModel
    {
        $model->save();

        return $model->refresh()->load(['store:id,name', 'order:id,order_number', 'counterparty:id,name,email']);
    }

    public function delete(FinancialTransactionModel $model): bool
    {
        return (bool) $model->delete();
    }
}
