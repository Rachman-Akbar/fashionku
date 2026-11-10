<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Queries;

use App\Domains\Catalog\Promotion\Application\Dtos\PromotionData;
use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionRepositoryInterface;

final class GetPromotionQuery
{
    public function __construct(private PromotionRepositoryInterface $repository) {}

    public function execute(array $filters = [], bool $includeInactive = false): array
    {
        return array_map(
            fn ($entity): PromotionData => PromotionData::fromArray($entity->toArray()),
            $this->repository->getAll($filters, $includeInactive)
        );
    }

    public function executeForSeller(int $storeId, array $filters = []): array
    {
        return array_map(
            fn ($entity): PromotionData => PromotionData::fromArray($entity->toArray()),
            $this->repository->getByStoreId($storeId, $filters, true)
        );
    }
}
