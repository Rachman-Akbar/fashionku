<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Services;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Customers\Domain\Repositories\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class CustomerService
{
    public function __construct(private CustomerRepositoryInterface $repository) {}

    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage, $storeId);
    }

    public function findForStore(string $userId, ?int $storeId): ?User
    {
        return $this->repository->findForStore($userId, $storeId);
    }

    public function create(array $data, int $storeId): User
    {
        return $this->repository->createManual($data, $storeId);
    }

    public function update(string $userId, array $data, ?int $storeId): ?User
    {
        return $this->repository->updateProfile($userId, $data, $storeId);
    }

    public function delete(string $userId, ?int $storeId): bool
    {
        return $this->repository->deleteForStore($userId, $storeId);
    }
}
