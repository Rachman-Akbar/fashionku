<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Domain\Repositories;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator;

    public function findForStore(string $userId, ?int $storeId): ?User;

    public function createManual(array $data, int $storeId): User;

    public function updateProfile(string $userId, array $data, ?int $storeId): ?User;

    public function deleteForStore(string $userId, ?int $storeId): bool;
}
