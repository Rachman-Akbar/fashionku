<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Domain\Repositories;

use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductReviewRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?string $userId, ?int $storeId): LengthAwarePaginator;

    public function find(int $id): ?ProductReviewModel;

    public function save(ProductReviewModel $model): ProductReviewModel;

    public function delete(ProductReviewModel $model): bool;
}
