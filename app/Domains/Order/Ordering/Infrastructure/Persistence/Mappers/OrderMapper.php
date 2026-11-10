<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Infrastructure\Persistence\Mappers;

use App\Domains\Order\Ordering\Domain\Entities\Order as DomainOrder;
use App\Domains\Order\Ordering\Domain\Entities\OrderItem as DomainOrderItem;
use App\Domains\Order\Ordering\Domain\Entities\SubOrder as DomainSubOrder;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;

final class OrderMapper
{
    public function toDomain(OrderModel $model): DomainOrder
    {
        $subOrders = $model->relationLoaded('subOrders')
            ? $model->subOrders->map(function ($subOrder): DomainSubOrder {
                $items = $subOrder->relationLoaded('items')
                    ? $subOrder->items->map(fn ($item) => new DomainOrderItem(
                        id: (int) $item->id,
                        productId: (int) $item->product_id,
                        variantId: (int) ($item->variant_id ?? 0),
                        storeId: (int) $subOrder->store_id,
                        productName: (string) $item->product_name,
                        sku: (string) $item->sku,
                        thumbnail: $item->thumbnail ? (string) $item->thumbnail : null,
                        price: (float) $item->price,
                        quantity: (int) $item->quantity
                    ))->all()
                    : [];

                return new DomainSubOrder(
                    id: (int) $subOrder->id,
                    storeId: (int) $subOrder->store_id,
                    storeName: (string) ($subOrder->store?->name ?? ''),
                    subOrderNumber: (string) $subOrder->sub_order_number,
                    totalItemsPrice: (float) $subOrder->total_items_price,
                    shippingCost: (float) $subOrder->shipping_cost,
                    courier: $subOrder->courier ? (string) $subOrder->courier : null,
                    service: $subOrder->service ? (string) $subOrder->service : null,
                    destinationId: (string) $subOrder->destination_id,
                    status: (string) $subOrder->status,
                    trackingNumber: $subOrder->tracking_number ? (string) $subOrder->tracking_number : null,
                    items: $items
                );
            })->all()
            : [];

        return new DomainOrder(
            id: (int) $model->id,
            orderNumber: (string) $model->order_number,
            orderType: (string) ($model->order_type ?? 'normal'),
            preorderReleaseAt: $model->preorder_release_at?->toIso8601String(),
            scheduledAt: $model->scheduled_at?->toIso8601String(),
            receivedAt: $model->received_at?->toIso8601String(),
            userId: (string) $model->user_id,
            voucherId: $model->voucher_id ? (int) $model->voucher_id : null,
            totalAmount: (float) $model->total_amount,
            discountAmount: (float) $model->discount_amount,
            shippingDiscountAmount: (float) ($model->shipping_discount_amount ?? 0),
            status: (string) $model->status,
            paymentStatus: (string) $model->payment_status,
            paymentMethod: $model->payment_method ? (string) $model->payment_method : null,
            snapToken: $model->midtrans_snap_token ? (string) $model->midtrans_snap_token : null,
            shippingAddress: (string) $model->shipping_address,
            subOrders: $subOrders,
            createdAt: $model->created_at?->toIso8601String(),
            updatedAt: $model->updated_at?->toIso8601String()
        );
    }

    public function toPersistenceArray(DomainOrder $entity): array
    {
        return [
            'order_number' => $entity->orderNumber,
            'order_type' => $entity->orderType,
            'preorder_release_at' => $entity->preorderReleaseAt,
            'scheduled_at' => $entity->scheduledAt,
            'received_at' => $entity->receivedAt,
            'user_id' => $entity->userId,
            'voucher_id' => $entity->voucherId,
            'total_amount' => $entity->totalAmount,
            'discount_amount' => $entity->discountAmount,
            'shipping_discount_amount' => $entity->shippingDiscountAmount,
            'status' => $entity->status,
            'payment_status' => $entity->paymentStatus,
            'payment_method' => $entity->paymentMethod,
            'midtrans_snap_token' => $entity->snapToken,
            'shipping_address' => $entity->shippingAddress,
        ];
    }
}
