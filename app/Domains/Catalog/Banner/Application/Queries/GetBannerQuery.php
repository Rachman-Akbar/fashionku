<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Application\Queries;

use App\Domains\Catalog\Banner\Application\Dtos\BannerData;
use App\Domains\Catalog\Banner\Domain\Repositories\BannerRepositoryInterface;

final class GetBannerQuery
{
    public function __construct(
        private BannerRepositoryInterface $repository
    ) {}

    public function executeAll(array $filters = []): array
    {
        return array_map(
            fn ($entity): BannerData => BannerData::fromArray($entity->toArray()),
            $this->repository->getAll($filters)
        );
    }

    public function execute(int $storeId, bool $includeInactive = false): array
    {
        return array_map(
            fn ($entity): BannerData => BannerData::fromArray($entity->toArray()),
            $this->repository->getByStoreId($storeId, $includeInactive)
        );
    }
}
