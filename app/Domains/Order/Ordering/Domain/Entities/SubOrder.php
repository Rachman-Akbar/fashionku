<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Domain\Entities;

final class SubOrder
{
    public function __construct(
        public ?int $id,
        public int $storeId,
        public string $storeName,
        public string $subOrderNumber,
        public float $totalItemsPrice,
        public float $shippingCost,
        public ?string $courier,
        public ?string $service,
        public string $destinationId,
        public string $status,
        public ?string $trackingNumber,
        public array $items = []
    ) {}
}
