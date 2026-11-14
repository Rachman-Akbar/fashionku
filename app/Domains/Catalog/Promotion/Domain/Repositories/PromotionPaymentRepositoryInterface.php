<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Domain\Repositories;

use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PromotionPaymentRepositoryInterface
{
    public function paginate(array $filters, int $perPage): LengthAwarePaginator;

    public function find(int $id): ?PromotionPaymentModel;

    public function save(PromotionPaymentModel $model): PromotionPaymentModel;

    public function approvedAvailable(int $id, ?int $promotionId = null): ?PromotionPaymentModel;
}
