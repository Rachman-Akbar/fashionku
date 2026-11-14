<?php

namespace App\Domains\Order\Addresses\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Addresses\Domain\Entities\Address;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentAddressRepository implements AddressRepositoryInterface
{
    public function getByOwner(?string $userId): Collection
    {
        return Address::when($userId, fn ($q) => $q->where('user_id', $userId))
            ->orderByDesc('is_primary')
            ->latest('id')
            ->get();
    }

    public function findByIdAndOwner(int $id, ?string $userId): ?Address
    {
        return Address::where('id', $id)
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->first();
    }

    public function save(Address $address): Address
    {
        $address->save();

        return $address;
    }

    public function delete(Address $address): bool
    {
        return (bool) $address->delete();
    }

    public function hasAddresses(?string $userId): bool
    {
        return Address::when($userId, fn ($q) => $q->where('user_id', $userId))->exists();
    }
}
