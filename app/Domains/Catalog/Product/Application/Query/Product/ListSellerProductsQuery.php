<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\Product;

use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

final class ListSellerProductsQuery
{
    public function __construct(
        private readonly ProductRepositoryInterface $products
    ) {}

    public function execute(string $sellerId, array $filters = []): LengthAwarePaginator
    {
        $filters['seller_id'] = $sellerId;
        $filters['include_inactive'] = true;

        $perPage = max(1, min(100, (int) ($filters['per_page'] ?? 20)));
        $page = max(1, (int) ($filters['page'] ?? 1));

        return $this->products->paginate($filters, $perPage, $page);
    }
}
