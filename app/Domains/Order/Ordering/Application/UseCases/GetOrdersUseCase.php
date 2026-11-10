<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class GetOrdersUseCase
{
    public function __construct(private OrderRepositoryInterface $orders) {}

    public function execute(
        string $authenticatedUserId,
        bool $canViewAllOrders = false,
        array $filters = [],
        int $perPage = 15,
    ): LengthAwarePaginator {

        $userId = $canViewAllOrders
            ? (($filters['user_id'] ?? null) ?: null)
            : $authenticatedUserId;

        // Memanggil repositori yang sudah terpaginasi & ter-cache
        return $this->orders->paginateForUser(
            userId: $userId !== null ? (string) $userId : null,
            filters: $filters,
            perPage: $perPage,
        );
    }
}
