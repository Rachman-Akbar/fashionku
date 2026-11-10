<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Domain\Entities;

final class SellerSettlement
{
    public function __construct(
        public ?int $id,
        public int $storeId,
        public int $orderId,
        public ?int $subOrderId,
        public string $settlementNumber,
        public float $grossAmount,
        public float $adminFee,
        public float $shippingFee,
        public float $netAmount,
        public string $status,
        public ?string $settledAt,
        public ?string $notes,
        public ?array $metadata,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
