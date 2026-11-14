<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Domain\Repositories;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CustomerRepositoryInterface
{
    public function paginate(array $filters, int $perPage): LengthAwarePaginator;

    public function find(string $userId): ?User;

    public function createManual(array $data): User;

    public function updateProfile(string $userId, array $data): ?User;

    public function deleteCustomer(string $userId): bool;
}
