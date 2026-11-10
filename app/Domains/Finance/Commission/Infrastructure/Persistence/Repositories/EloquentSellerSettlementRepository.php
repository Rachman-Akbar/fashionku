<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Infrastructure\Persistence\Repositories;

use App\Domains\Finance\Commission\Domain\Entities\SellerSettlement;
use App\Domains\Finance\Commission\Domain\Repositories\SellerSettlementRepositoryInterface;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Models\SellerSettlementModel;
use Illuminate\Support\Str;

class EloquentSellerSettlementRepository implements SellerSettlementRepositoryInterface
{
    public function findById(int $id): ?SellerSettlement
    {
        $model = SellerSettlementModel::find($id);

        return $model ? $this->toEntity($model) : null;
    }

    public function findByOrderAndSubOrder(int $orderId, ?int $subOrderId): ?SellerSettlement
    {
        $query = SellerSettlementModel::where('order_id', $orderId);

        if ($subOrderId) {
            $query->where('sub_order_id', $subOrderId);
        } else {
            $query->whereNull('sub_order_id');
        }

        $model = $query->first();

        return $model ? $this->toEntity($model) : null;
    }

    public function create(array $data): SellerSettlement
    {
        if (empty($data['settlement_number'])) {
            $data['settlement_number'] = 'STL-'.strtoupper(Str::random(10));
        }

        $model = SellerSettlementModel::create($data);

        return $this->toEntity($model);
    }

    public function update(int $id, array $data): SellerSettlement
    {
        $model = SellerSettlementModel::findOrFail($id);
        $model->update($data);

        return $this->toEntity($model->fresh());
    }

    public function getByStore(int $storeId, array $filters = [], int $perPage = 20): mixed
    {
        $query = SellerSettlementModel::where('store_id', $storeId);

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (! empty($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function getTotalByStore(int $storeId, string $status = 'settled'): float
    {
        return (float) SellerSettlementModel::where('store_id', $storeId)
            ->where('status', $status)
            ->sum('net_amount');
    }

    public function settlePending(int $storeId): float
    {
        $pending = SellerSettlementModel::where('store_id', $storeId)
            ->where('status', 'pending')
            ->get();

        $totalSettled = 0.0;

        foreach ($pending as $settlement) {
            $settlement->update([
                'status' => 'settled',
                'settled_at' => now()->toDateTimeString(),
            ]);
            $totalSettled += (float) $settlement->net_amount;
        }

        return $totalSettled;
    }

    private function toEntity(SellerSettlementModel $model): SellerSettlement
    {
        return new SellerSettlement(
            id: $model->id,
            storeId: $model->store_id,
            orderId: $model->order_id,
            subOrderId: $model->sub_order_id,
            settlementNumber: $model->settlement_number,
            grossAmount: (float) $model->gross_amount,
            adminFee: (float) $model->admin_fee,
            shippingFee: (float) $model->shipping_fee,
            netAmount: (float) $model->net_amount,
            status: $model->status,
            settledAt: $model->settled_at?->toDateTimeString(),
            notes: $model->notes,
            metadata: $model->metadata,
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString(),
        );
    }
}
