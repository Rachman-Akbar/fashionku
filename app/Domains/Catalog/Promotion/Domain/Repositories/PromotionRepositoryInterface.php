<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Domain\Repositories;

use App\Domains\Catalog\Promotion\Domain\Entities\Promotion;

interface PromotionRepositoryInterface
{
    public function getAll(array $filters = [], bool $includeInactive = false): array;

    public function findById(int $id, bool $includeInactive = true): ?Promotion;

    public function nameExists(string $name, ?int $ignoreId = null): bool;

    public function save(Promotion $promotion): Promotion;

    public function delete(int $id): bool;
}
