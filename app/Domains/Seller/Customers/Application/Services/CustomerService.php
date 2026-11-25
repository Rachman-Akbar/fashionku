<?php

declare(strict_types=1);

namespace App\Domains\Seller\Customers\Application\Services;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Customers\Domain\Repositories\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class CustomerService
{
    public function __construct(private CustomerRepositoryInterface $repository) {}

    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        $paginator = $this->repository->paginate($filters, $perPage);

        // Kolom audit `created_by`/`updated_by` berasal dari tabel
        // seller_customers; namanya diambil sekali untuk seluruh halaman.
        $ids = [];

        foreach ($paginator->items() as $row) {
            foreach (['customer_created_by', 'customer_updated_by'] as $column) {
                $value = $row->getAttribute($column);

                if (is_string($value) && $value !== '') {
                    $ids[$value] = $value;
                }
            }
        }

        $names = $ids === []
            ? []
            : DB::table('users')->whereIn('id', array_values($ids))->pluck('name', 'id')->all();

        foreach ($paginator->items() as $row) {
            $row->setAttribute('audit_user_names', $names);
        }

        return $paginator;
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
