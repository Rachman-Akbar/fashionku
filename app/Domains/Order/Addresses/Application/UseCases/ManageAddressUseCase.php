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
use Throwable;

final class ManageAddressUseCase
{
    public function __construct(
        private AddressRepositoryInterface $addressRepository,
        private ResolveAddressDestinationUseCase $resolveDestinationUseCase
    ) {}

    public function listAddresses(?string $userId): Collection
    {
        return $this->addressRepository->getByOwner($userId);
    }

    public function createAddress(AddressDTO $dto): Address
    {
        $this->resolveDestination($dto);

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

            $this->resolveDestination($dto, $address);

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

    private function resolveDestination(AddressDTO $dto, ?Address $currentAddress = null): void
    {
        try {
            $resolved = $this->resolveDestinationUseCase->execute($dto->destinationLookupData());
            $dto->komerce_destination_id = $resolved->id;

            return;
        } catch (Throwable) {
        }

        if ($currentAddress !== null && $this->hasSameDestinationData($currentAddress, $dto)) {
            $currentDestinationId = trim((string) $currentAddress->komerce_destination_id);
            $dto->komerce_destination_id = $currentDestinationId !== ''
                ? $currentDestinationId
                : null;

            return;
        }

        $dto->komerce_destination_id = null;
    }

    private function hasSameDestinationData(Address $address, AddressDTO $dto): bool
    {
        return $this->normalize((string) $address->country) === $this->normalize($dto->country)
            && $this->normalize((string) $address->province) === $this->normalize($dto->province)
            && $this->normalize((string) $address->city_or_regency) === $this->normalize($dto->city_or_regency)
            && $this->normalize((string) $address->district) === $this->normalize($dto->district)
            && $this->normalize((string) $address->subdistrict) === $this->normalize($dto->subdistrict)
            && $this->normalizePostalCode((string) $address->postal_code) === $this->normalizePostalCode($dto->postal_code);
    }

    private function normalize(string $value): string
    {
        return mb_strtolower(trim(preg_replace('/\s+/', ' ', $value) ?? $value));
    }

    private function normalizePostalCode(string $value): string
    {
        return preg_replace('/\D+/', '', $value) ?? '';
    }
}
