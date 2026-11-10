<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Domain\ValueObjects;

use InvalidArgumentException;

final class Money
{
    public function __construct(private readonly int $amount)
    {
        if ($amount < 0) {
            throw new InvalidArgumentException('Nilai uang tidak boleh negatif.');
        }
    }

    public function getAmount(): int
    {
        return $this->amount;
    }

    public function multiply(int $multiplier): self
    {
        return new self($this->amount * $multiplier);
    }

    public function add(self $other): self
    {
        return new self($this->amount + $other->getAmount());
    }
}
