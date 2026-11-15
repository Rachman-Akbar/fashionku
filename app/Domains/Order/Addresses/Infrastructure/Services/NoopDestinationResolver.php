<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Infrastructure\Services;

use App\Domains\Order\Addresses\Domain\Services\DestinationResolverInterface;
use App\Domains\Order\Addresses\Domain\ValueObjects\ResolvedDestination;

/**
 * Single-store: destination ID resolution (RajaOngkir/Komerce) is disabled.
 * Returns an empty destination; haversine shipping does not depend on it.
 */
final class NoopDestinationResolver implements DestinationResolverInterface
{
    public function resolve(array $address): ResolvedDestination
    {
        return new ResolvedDestination('', '', '', '', '', '', '');
    }
}
