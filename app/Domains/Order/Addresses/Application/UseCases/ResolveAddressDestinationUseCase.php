<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Application\UseCases;

use App\Domains\Order\Addresses\Domain\Services\DestinationResolverInterface;
use App\Domains\Order\Addresses\Domain\ValueObjects\ResolvedDestination;

final class ResolveAddressDestinationUseCase
{
    public function __construct(
        private DestinationResolverInterface $destinationResolver
    ) {}

    public function execute(array $address): ResolvedDestination
    {
        return $this->destinationResolver->resolve($address);
    }
}
