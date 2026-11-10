<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Application\Query\Product;

use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;

final class ListProductsQuery
{
    public function __construct(
        private readonly ProductRepositoryInterface $products
    ) {}

    public function execute(array $filters = []): CursorPaginator
    {
        $filters['status'] = $filters['status'] ?? 'published';
        $filters['is_active'] = true;
        $filters['include'] = $filters['include'] ?? 'summary';

        $perPage = max(1, min(50, (int) ($filters['per_page'] ?? 24)));

        return $this->products->cursorPaginate($filters, $perPage);
    }
}
