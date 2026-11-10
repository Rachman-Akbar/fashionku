<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Domain\Entities;

final class SellerWithdrawal
{
    public function __construct(
        public ?int $id,
        public int $storeId,
        public string $userId,
        public string $withdrawalNumber,
        public float $amount,
        public string $method,
        public ?array $bankDetails,
        public string $status,
        public ?string $rejectionReason,
        public ?string $processedAt,
        public ?string $processedBy,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}
}
