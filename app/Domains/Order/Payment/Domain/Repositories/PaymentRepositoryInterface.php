<?php

namespace App\Domains\Order\Payment\Domain\Repositories;

use App\Domains\Order\Payment\Domain\Entities\Payment;

interface PaymentRepositoryInterface
{
    public function save(Payment $payment): Payment;

    public function findByOrderNumber(string $orderNumber): ?Payment;
}
