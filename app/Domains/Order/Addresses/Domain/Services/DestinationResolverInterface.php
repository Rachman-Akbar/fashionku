<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Domain\Services;

use App\Domains\Order\Addresses\Domain\ValueObjects\ResolvedDestination;

interface DestinationResolverInterface
{
    public function resolve(array $address): ResolvedDestination;
}
