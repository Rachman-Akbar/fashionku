<?php

namespace App\Domains\Order\Addresses\Domain\Repositories;

use App\Domains\Order\Addresses\Domain\Entities\Address;
use Illuminate\Support\Collection;

interface AddressRepositoryInterface
{
    public function getByOwner(?string $userId): Collection;

    public function findByIdAndOwner(int $id, ?string $userId): ?Address;

    public function save(Address $address): Address;

    public function delete(Address $address): bool;

    public function hasAddresses(?string $userId): bool;
}
