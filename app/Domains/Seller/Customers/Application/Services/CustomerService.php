<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Services;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Customers\Domain\Repositories\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class CustomerService
{
    public function __construct(private CustomerRepositoryInterface $repository) {}

    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage);
    }

    public function find(string $userId): ?User
    {
        return $this->repository->find($userId);
    }

    public function create(array $data): User
    {
        return $this->repository->createManual($data);
    }

    public function update(string $userId, array $data): ?User
    {
        return $this->repository->updateProfile($userId, $data);
    }

    public function delete(string $userId): bool
    {
        return $this->repository->deleteCustomer($userId);
    }
}
