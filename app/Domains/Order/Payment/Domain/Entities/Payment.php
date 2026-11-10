<?php

namespace App\Domains\Order\Payment\Domain\Entities;

class Payment
{
    public function __construct(
        public ?int $id,
        public string $orderNumber,
        public ?string $transactionId,
        public string $paymentMethod,
        public float $amount,
        public string $status,
        public ?array $payload = null
    ) {}

    public function markAsSuccess(?string $transactionId, array $payload): void
    {
        $this->status = 'success';
        $this->transactionId = $transactionId;
        $this->payload = $payload;
    }

    public function markAsFailed(array $payload): void
    {
        $this->status = 'failed';
        $this->payload = $payload;
    }
}
