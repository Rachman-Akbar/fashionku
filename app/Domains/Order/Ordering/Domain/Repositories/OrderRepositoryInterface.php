<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Domain\Repositories;

use App\Domains\Order\Ordering\Domain\Entities\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function create(Order $order): Order;

    public function update(Order $order): void;

    public function findById(int $id): ?Order;

    public function findByOrderNumber(string $orderNumber, bool $lock = false): ?Order;

    public function getByUserId(string $userId): array;

    public function paginateForUser(?string $userId, array $filters, int $perPage): LengthAwarePaginator;
}
