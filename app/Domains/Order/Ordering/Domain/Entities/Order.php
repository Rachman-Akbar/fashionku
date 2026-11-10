<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Domain\Entities;

final class Order
{
    public function __construct(
        public ?int $id,
        public string $orderNumber,
        public string $orderType,
        public ?string $preorderReleaseAt,
        public ?string $scheduledAt,
        public ?string $receivedAt,
        public string $userId,
        public ?int $voucherId,
        public float $totalAmount,
        public float $discountAmount,
        public float $shippingDiscountAmount,
        public string $status,
        public string $paymentStatus,
        public ?string $paymentMethod,
        public ?string $snapToken,
        public string $shippingAddress,
        public array $subOrders = [],
        public ?string $createdAt = null,
        public ?string $updatedAt = null
    ) {}

    public function getFinalPay(): float
    {
        return max(0.0, $this->totalAmount - $this->discountAmount - $this->shippingDiscountAmount);
    }

    public function getShippingCostByStore(int $storeId): float
    {
        foreach ($this->subOrders as $subOrder) {
            if ($subOrder->storeId === $storeId) {
                return $subOrder->shippingCost;
            }
        }

        return 0.0;
    }
}
