<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Application\UseCases;

use App\Domains\Catalog\Banner\Domain\Repositories\BannerRepositoryInterface;
use InvalidArgumentException;

final class DeleteBannerUseCase
{
    public function __construct(
        private BannerRepositoryInterface $repository
    ) {}

    public function execute(int $id, ?int $storeId = null): bool
    {
        $banner = $this->repository->findById($id, true);

        if (! $banner) {
            throw new InvalidArgumentException('Banner toko tidak ditemukan.');
        }

        if ($storeId !== null && $banner->storeId !== $storeId) {
            throw new InvalidArgumentException('Anda tidak memiliki akses ke banner ini.');
        }

        return $this->repository->delete($id);
    }
}
