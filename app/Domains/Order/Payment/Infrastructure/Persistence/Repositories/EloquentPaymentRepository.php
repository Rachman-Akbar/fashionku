<?php

namespace App\Domains\Order\Payment\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Payment\Domain\Entities\Payment;
use App\Domains\Order\Payment\Domain\Repositories\PaymentRepositoryInterface;
use App\Domains\Order\Payment\Infrastructure\Persistence\Mappers\PaymentMapper;
use App\Domains\Order\Payment\Infrastructure\Persistence\Models\PaymentModel;

class EloquentPaymentRepository implements PaymentRepositoryInterface
{
    public function __construct(private PaymentMapper $mapper) {}

    public function save(Payment $payment): Payment
    {
        $model = PaymentModel::updateOrCreate(
            ['order_number' => $payment->orderNumber],
            $this->mapper->toPersistenceArray($payment)
        );

        return $this->mapper->toDomain($model);
    }

    public function findByOrderNumber(string $orderNumber): ?Payment
    {
        $model = PaymentModel::where('order_number', $orderNumber)->first();

        return $model ? $this->mapper->toDomain($model) : null;
    }
}
