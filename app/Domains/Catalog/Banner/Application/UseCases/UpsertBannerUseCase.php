<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Application\UseCases;

use App\Domains\Catalog\Banner\Application\Dtos\BannerData;
use App\Domains\Catalog\Banner\Domain\Entities\Banner;
use App\Domains\Catalog\Banner\Domain\Repositories\BannerRepositoryInterface;
use InvalidArgumentException;

final class UpsertBannerUseCase
{
    public function __construct(
        private BannerRepositoryInterface $repository
    ) {}

    public function execute(BannerData $dto, ?int $id = null): BannerData
    {
        if ($id !== null) {
            $existing = $this->repository->findById($id, true);

            if (! $existing) {
                throw new InvalidArgumentException('Banner toko tidak ditemukan.');
            }

            if ($existing->storeId !== $dto->storeId) {
                throw new InvalidArgumentException('Anda tidak memiliki akses ke banner ini.');
            }
        }

        if ($this->repository->nameExistsForStore($dto->name, $dto->storeId, $id)) {
            throw new InvalidArgumentException("Nama banner '{$dto->name}' sudah digunakan pada toko ini.");
        }

        $entity = new Banner(
            id: $id,
            storeId: $dto->storeId,
            name: $dto->name,
            imageUrl: $dto->imageUrl,
            sortOrder: $dto->sortOrder,
            isActive: $dto->isActive
        );

        return BannerData::fromArray($this->repository->save($entity)->toArray());
    }
}
