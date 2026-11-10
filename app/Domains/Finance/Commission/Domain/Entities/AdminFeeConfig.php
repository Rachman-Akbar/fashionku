<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Domain\Entities;

final class AdminFeeConfig
{
    public function __construct(
        public ?int $id,
        public ?int $categoryId,
        public string $name,
        public string $code,
        public float $percentage,
        public float $fixedAmount,
        public float $minFee,
        public float $maxFee,
        public bool $isActive,
        public ?string $description,
        public ?string $createdAt = null,
        public ?string $updatedAt = null,
    ) {}

    public function calculateFee(float $amount): float
    {
        $fee = ($amount * $this->percentage / 100) + $this->fixedAmount;

        if ($this->minFee > 0 && $fee < $this->minFee) {
            $fee = $this->minFee;
        }

        if ($this->maxFee > 0 && $fee > $this->maxFee) {
            $fee = $this->maxFee;
        }

        return round($fee, 2);
    }
}
