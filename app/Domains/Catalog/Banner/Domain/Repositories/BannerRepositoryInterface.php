<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Domain\Repositories;

use App\Domains\Catalog\Banner\Domain\Entities\Banner;

interface BannerRepositoryInterface
{
    public function getAll(array $filters = []): array;

    public function getByStoreId(int $storeId, bool $includeInactive = false): array;

    public function findById(int $id, bool $includeInactive = true): ?Banner;

    public function nameExistsForStore(string $name, int $storeId, ?int $ignoreId = null): bool;

    public function save(Banner $banner): Banner;

    public function delete(int $id): bool;
}
