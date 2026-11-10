<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Domain\Repositories;

use App\Domains\Finance\Commission\Domain\Entities\AdminFeeConfig;

interface AdminFeeConfigRepositoryInterface
{
    public function findById(int $id): ?AdminFeeConfig;

    public function findByCategoryId(?int $categoryId): ?AdminFeeConfig;

    public function findDefault(): ?AdminFeeConfig;

    public function getActive(): array;

    public function create(array $data): AdminFeeConfig;

    public function update(int $id, array $data): AdminFeeConfig;

    public function delete(int $id): void;
}
