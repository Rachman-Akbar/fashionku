<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

final class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $order = $this->resource;
        $subOrders = $this->toArrayValue($this->read($order, 'subOrders') ?? $this->read($order, 'sub_orders'));
        $items = [];
        $shippingCost = 0.0;
        $subtotal = 0.0;
        $subOrderRows = [];

        foreach ($subOrders as $subOrder) {
            $subItems = $this->toArrayValue($this->read($subOrder, 'items'));
            $shipping = $this->money($this->read($subOrder, 'shippingCost') ?? $this->read($subOrder, 'shipping_cost'));
            $itemsTotal = $this->money($this->read($subOrder, 'totalItemsPrice') ?? $this->read($subOrder, 'total_items_price'));
            $shippingCost += $shipping;
            $subtotal += $itemsTotal;
            $items = array_merge($items, $subItems);

            $subOrderRows[] = [
                'id' => $this->read($subOrder, 'id'),
                'store_id' => $this->read($subOrder, 'storeId') ?? $this->read($subOrder, 'store_id'),
                'store_name' => $this->read($subOrder, 'storeName') ?? $this->read($subOrder, 'store_name'),
                'sub_order_number' => $this->read($subOrder, 'subOrderNumber') ?? $this->read($subOrder, 'sub_order_number'),
                'total_items_price' => $itemsTotal,
                'shipping_cost' => $shipping,
                'courier' => $this->read($subOrder, 'courier'),
                'service' => $this->read($subOrder, 'service'),
                'destination_id' => $this->read($subOrder, 'destinationId') ?? $this->read($subOrder, 'destination_id'),
                'status' => $this->read($subOrder, 'status'),
                'tracking_number' => $this->read($subOrder, 'trackingNumber') ?? $this->read($subOrder, 'tracking_number'),
                'items' => OrderItemResource::collection(collect($subItems)),
            ];
        }

        $totalAmount = $this->money($this->read($order, 'totalAmount') ?? $this->read($order, 'total_amount'));
        $discount = $this->money($this->read($order, 'discountAmount') ?? $this->read($order, 'discount_amount'));
        $shippingDiscount = $this->money($this->read($order, 'shippingDiscountAmount') ?? $this->read($order, 'shipping_discount_amount'));
        $grandTotal = max(0, $totalAmount - $discount - $shippingDiscount);

        return [
            'id' => $this->read($order, 'id'),
            'order_number' => $this->read($order, 'orderNumber') ?? $this->read($order, 'order_number'),
            'order_type' => $this->read($order, 'orderType') ?? $this->read($order, 'order_type') ?? 'normal',
            'preorder_release_at' => $this->date($this->read($order, 'preorderReleaseAt') ?? $this->read($order, 'preorder_release_at')),
            'scheduled_at' => $this->date($this->read($order, 'scheduledAt') ?? $this->read($order, 'scheduled_at')),
            'received_at' => $this->date($this->read($order, 'receivedAt') ?? $this->read($order, 'received_at')),
            'user_id' => $this->read($order, 'userId') ?? $this->read($order, 'user_id'),
            'status' => $this->read($order, 'status'),
            'payment_status' => $this->read($order, 'paymentStatus') ?? $this->read($order, 'payment_status'),
            'subtotal' => $subtotal,
            'total_amount' => $totalAmount,
            'shipping_cost' => $shippingCost,
            'discount_amount' => $discount,
            'shipping_discount_amount' => $shippingDiscount,
            'grand_total' => $grandTotal,
            'shipping_address' => $this->read($order, 'shippingAddress') ?? $this->read($order, 'shipping_address'),
            'payment_method' => $this->read($order, 'paymentMethod') ?? $this->read($order, 'payment_method'),
            'snap_token' => $this->read($order, 'snapToken') ?? $this->read($order, 'midtrans_snap_token'),
            'items' => OrderItemResource::collection(collect($items)),
            'sub_orders' => $subOrderRows,
            'created_at' => $this->date($this->read($order, 'createdAt') ?? $this->read($order, 'created_at')),
            'updated_at' => $this->date($this->read($order, 'updatedAt') ?? $this->read($order, 'updated_at')),
        ];
    }

    private function read(object|array|null $source, string $key): mixed
    {
        if ($source === null) {
            return null;
        }
        if (is_array($source)) {
            return $source[$key] ?? null;
        }
        if (method_exists($source, $key)) {
            return $source->{$key}();
        }

        return $source->{$key} ?? null;
    }

    private function money(mixed $value): float
    {
        if (is_object($value) && method_exists($value, 'amount')) {
            return (float) $value->amount();
        }

        return (float) ($value ?? 0);
    }

    private function date(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        if (is_object($value) && method_exists($value, 'toIso8601String')) {
            return $value->toIso8601String();
        }
        if (is_object($value) && method_exists($value, 'format')) {
            return $value->format(DATE_ATOM);
        }

        return (string) $value;
    }

    private function toArrayValue(mixed $value): array
    {
        if ($value instanceof Collection) {
            return $value->all();
        }
        if (is_array($value)) {
            return $value;
        }
        if ($value instanceof \Traversable) {
            return iterator_to_array($value);
        }

        return [];
    }
}
