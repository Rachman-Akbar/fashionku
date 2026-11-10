<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Application\Queries;

use App\Domains\Seller\Stores\Domain\Entities\Store;
use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;

final readonly class GetStoreBySlugQuery
{
    public function __construct(private StoreRepositoryInterface $repository) {}

    public function execute(string $slug, bool $publicOnly = false): ?Store
    {
        return $this->repository->findBySlug($slug, $publicOnly);
    }
}
