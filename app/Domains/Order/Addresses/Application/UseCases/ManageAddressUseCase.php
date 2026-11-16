<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Application\UseCases;

use App\Domains\Order\Addresses\Application\DTOs\AddressDTO;
use App\Domains\Order\Addresses\Domain\Entities\Address;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use App\Domains\Order\Addresses\Infrastructure\Persistence\Mappers\AddressMapper;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class ManageAddressUseCase
{
    public function __construct(
        private AddressRepositoryInterface $addressRepository
    ) {}

    public function listAddresses(?string $userId): Collection
    {
        return $this->addressRepository->getByOwner($userId);
    }

    public function createAddress(AddressDTO $dto): Address
    {
        return DB::transaction(function () use ($dto): Address {
            $isFirstAddress = ! $this->addressRepository->hasAddresses($dto->user_id);
            $address = new Address(AddressMapper::toEntityArray($dto));

            $this->addressRepository->save($address);

            if ($dto->is_primary || $isFirstAddress) {
                $address->markAsPrimary();
            }

            return $address->fresh();
        });
    }

    public function updateAddress(int $id, AddressDTO $dto): Address
    {
        return DB::transaction(function () use ($id, $dto): Address {
            $address = $this->addressRepository->findByIdAndOwner($id, $dto->user_id);

            if (! $address) {
                throw new ModelNotFoundException('Alamat tidak ditemukan atau Anda tidak memiliki akses.');
            }

            $wasPrimary = (bool) $address->is_primary;
            $address->fill(AddressMapper::toEntityArray($dto));

            $this->addressRepository->save($address);

            if ($dto->is_primary) {
                $address->markAsPrimary();
            } elseif ($wasPrimary && $dto->user_id !== null) {
                $replacement = $this->addressRepository
                    ->getByOwner($dto->user_id)
                    ->first(fn (Address $item): bool => $item->getKey() !== $address->getKey());

                if ($replacement) {
                    $replacement->markAsPrimary();
                } else {
                    $address->markAsPrimary();
                }
            }

            return $address->fresh();
        });
    }

    public function deleteAddress(int $id, ?string $userId): bool
    {
        return DB::transaction(function () use ($id, $userId): bool {
            $address = $this->addressRepository->findByIdAndOwner($id, $userId);

            if (! $address) {
                throw new ModelNotFoundException('Alamat tidak ditemukan atau Anda tidak memiliki akses.');
            }

            $wasPrimary = (bool) $address->is_primary;
            $deleted = $this->addressRepository->delete($address);

            if ($deleted && $wasPrimary && $userId !== null) {
                $replacement = $this->addressRepository->getByOwner($userId)->first();
                $replacement?->markAsPrimary();
            }

            return $deleted;
        });
    }
}
