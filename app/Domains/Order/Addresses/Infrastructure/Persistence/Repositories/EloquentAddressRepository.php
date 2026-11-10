<?php

namespace App\Domains\Order\Addresses\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Addresses\Domain\Entities\Address;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentAddressRepository implements AddressRepositoryInterface
{
    public function getByOwner(?string $userId, ?string $storeId): Collection
    {
        return Address::when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
            ->orderByDesc('is_primary')
            ->latest('id')
            ->get();
    }

    public function findByIdAndOwner(int $id, ?string $userId, ?string $storeId): ?Address
    {
        return Address::where('id', $id)
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
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

    public function hasAddresses(?string $userId, ?string $storeId): bool
    {
        return Address::when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
            ->exists();
    }
}
