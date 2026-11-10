<?php

namespace App\Domains\Order\Ordering\Domain\Services;

interface ShippingCalculatorInterface
{
    public function calculate(array $data): float;
}
