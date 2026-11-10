<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Queries;

use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use Illuminate\Pagination\CursorPaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ListProductsByCategoryPathQuery
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly ProductRepositoryInterface $productRepository,
    ) {}

    public function execute(string $path, array $filters = []): CursorPaginator
    {
        $category = $this->categoryRepository->findByPath($path);

        if (! $category) {
            throw new NotFoundHttpException('Category not found.');
        }

        $filters['category_id'] = $category->id();
        $filters['include_descendants'] = filter_var(
            $filters['include_descendants'] ?? true,
            FILTER_VALIDATE_BOOLEAN
        );
        $filters['status'] = 'published';
        $filters['is_active'] = true;
        $filters['include'] = $filters['include'] ?? 'summary';

        $perPage = max(1, min(50, (int) ($filters['per_page'] ?? 24)));

        return $this->productRepository->cursorPaginate($filters, $perPage);
    }
}
