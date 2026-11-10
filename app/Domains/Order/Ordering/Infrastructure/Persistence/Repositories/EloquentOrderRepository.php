<?php

namespace App\Domains\Order\Ordering\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Ordering\Domain\Entities\Order as DomainOrder;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Mappers\OrderMapper;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderItemModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\LengthAwarePaginator as LengthAwarePaginatorConcrete;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class EloquentOrderRepository implements OrderRepositoryInterface
{
    public function __construct(
        private OrderMapper $mapper,
        private StockMovementService $stockMovementService
    ) {}

    public function create(DomainOrder $order): DomainOrder
    {
        return DB::transaction(function () use ($order): DomainOrder {
            $this->clearUserOrderCache($order->userId);
            $orderModel = OrderModel::create($this->mapper->toPersistenceArray($order));

            foreach ($order->subOrders as $subOrder) {
                $subOrderModel = SubOrderModel::create([
                    'order_id' => $orderModel->id,
                    'store_id' => $subOrder->storeId,
                    'sub_order_number' => $subOrder->subOrderNumber,
                    'total_items_price' => $subOrder->totalItemsPrice,
                    'shipping_cost' => $subOrder->shippingCost,
                    'courier' => $subOrder->courier,
                    'service' => $subOrder->service,
                    'destination_id' => $subOrder->destinationId,
                    'status' => $subOrder->status,
                ]);

                foreach ($subOrder->items as $item) {
                    OrderItemModel::create([
                        'sub_order_id' => $subOrderModel->id,
                        'product_id' => $item->productId,
                        'variant_id' => $item->variantId,
                        'product_name' => $item->productName,
                        'sku' => $item->sku,
                        'thumbnail' => $item->thumbnail,
                        'price' => $item->price,
                        'quantity' => $item->quantity,
                    ]);
                }
            }

            $savedModel = OrderModel::with(['subOrders.items', 'subOrders.store'])->findOrFail($orderModel->id);

            return $this->mapper->toDomain($savedModel);
        });
    }

    public function update(DomainOrder $order): void
    {
        DB::transaction(function () use ($order): void {
            $model = OrderModel::query()->lockForUpdate()->find($order->id);

            if (! $model) {
                return;
            }

            $previousStatus = (string) $model->status;
            $receivedAt = $order->receivedAt;

            if ($order->status === 'received' && ! $receivedAt) {
                $receivedAt = now()->toDateTimeString();
                $order->receivedAt = $receivedAt;
            }

            $model->update([
                'order_type' => $order->orderType,
                'preorder_release_at' => $order->preorderReleaseAt,
                'scheduled_at' => $order->scheduledAt,
                'received_at' => $receivedAt,
                'status' => $order->status,
                'payment_status' => $order->paymentStatus,
                'payment_method' => $order->paymentMethod,
                'midtrans_snap_token' => $order->snapToken,
            ]);

            if (in_array($order->status, ['processing', 'shipped', 'received', 'completed', 'cancelled'], true)) {
                SubOrderModel::query()
                    ->where('order_id', $model->id)
                    ->when($order->status !== 'cancelled', fn ($query) => $query->whereNotIn('status', ['completed', 'cancelled']))
                    ->when($order->status === 'cancelled', fn ($query) => $query->whereNotIn('status', ['received', 'completed', 'cancelled']))
                    ->update([
                        'status' => $order->status,
                        'updated_at' => now(),
                    ]);
            }

            $this->stockMovementService->syncOrderStatus((int) $model->id, $previousStatus, $order->status);
            $this->clearUserOrderCache((string) $model->user_id);
        });
    }

    public function findById(int $id): ?DomainOrder
    {
        $model = OrderModel::with(['subOrders.items', 'subOrders.store'])->find($id);

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function findByOrderNumber(string $orderNumber, bool $lock = false): ?DomainOrder
    {
        $query = OrderModel::with(['subOrders.items', 'subOrders.store'])
            ->where('order_number', $orderNumber);

        if ($lock) {
            $query->lockForUpdate();
        }

        $model = $query->first();

        return $model ? $this->mapper->toDomain($model) : null;
    }

    public function getByUserId(string $userId): array
    {
        return OrderModel::with(['subOrders.items', 'subOrders.store'])
            ->where('user_id', $userId)
            ->get()
            ->map(fn ($model) => $this->mapper->toDomain($model))
            ->all();
    }

    public function paginateForUser(?string $userId, array $filters, int $perPage): LengthAwarePaginator
    {
        $page = max(1, (int) request()->query('page', 1));
        $version = (int) Cache::get('orders_cache_version', 1);
        $cacheKey = 'orders:'.$version.':'.md5(json_encode([
            'user_id' => $userId,
            'filters' => $filters,
        ]));

        $query = OrderModel::with(['subOrders.items', 'subOrders.store']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if (! empty($filters['user_id'])) {
            $query->where('user_id', (string) $filters['user_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (! empty($filters['order_type'])) {
            $query->where('order_type', $filters['order_type']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where('order_number', 'like', "%{$search}%");
        }

        $total = Cache::remember("{$cacheKey}.total", now()->addMinutes(5), fn (): int => $query->count());
        $models = $query->latest()->forPage($page, $perPage)->get();
        $items = $models->map(fn ($model) => $this->mapper->toDomain($model))->values();

        return new LengthAwarePaginatorConcrete($items, $total, $perPage, $page, [
            'path' => LengthAwarePaginatorConcrete::resolveCurrentPath(),
            'pageName' => 'page',
        ]);
    }

    private function clearUserOrderCache(string $userId): void
    {
        $version = (int) Cache::get('orders_cache_version', 1);
        Cache::forever('orders_cache_version', $version + 1);
    }
}
