<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Application\Services;

use App\Domains\Order\Review\Domain\Repositories\ProductReviewRepositoryInterface;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class ProductReviewService
{
    public function __construct(
        private ProductReviewRepositoryInterface $repository
    ) {}

    public function paginate(array $filters, int $perPage, ?string $userId, ?int $storeId): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage, $userId, $storeId);
    }

    public function create(array $data, string $userId): ProductReviewModel
    {
        return DB::transaction(function () use ($data, $userId): ProductReviewModel {
            $item = DB::table('order_items')
                ->join('sub_orders', 'sub_orders.id', '=', 'order_items.sub_order_id')
                ->join('orders', 'orders.id', '=', 'sub_orders.order_id')
                ->where('order_items.id', (int) $data['order_item_id'])
                ->where('orders.user_id', $userId)
                ->select([
                    'order_items.id',
                    'order_items.product_id',
                    'orders.id as order_id',
                    'orders.status',
                ])
                ->lockForUpdate()
                ->first();

            if (! $item) {
                throw new InvalidArgumentException('Item pesanan tidak ditemukan atau bukan milik Anda.');
            }

            if (! in_array((string) $item->status, ['received', 'completed'], true)) {
                throw new InvalidArgumentException('Review hanya dapat diberikan setelah pesanan diterima atau selesai.');
            }

            if (ProductReviewModel::withTrashed()->where('order_item_id', $item->id)->exists()) {
                throw new InvalidArgumentException('Item pesanan ini sudah pernah direview.');
            }

            $review = $this->repository->save(new ProductReviewModel([
                'product_id' => (int) $item->product_id,
                'order_id' => (int) $item->order_id,
                'order_item_id' => (int) $item->id,
                'user_id' => $userId,
                'rating' => (int) $data['rating'],
                'review' => $data['review'] ?? null,
                'media' => $data['media'] ?? null,
                'is_active' => true,
            ]));

            return $review;
        });
    }

    public function update(int $id, array $data, string $userId, bool $manage = false): ProductReviewModel
    {
        $model = $this->repository->find($id);

        if (! $model || (! $manage && $model->user_id !== $userId)) {
            throw new InvalidArgumentException('Review tidak ditemukan.');
        }

        $update = [];

        if ($model->user_id === $userId) {
            $update['rating'] = (int) $data['rating'];
            $update['review'] = $data['review'] ?? null;
            $update['media'] = $data['media'] ?? null;
        }

        if ($manage && array_key_exists('is_active', $data)) {
            $update['is_active'] = filter_var($data['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        $model->fill($update);

        return $this->repository->save($model);
    }

    public function delete(int $id, string $userId, bool $admin): void
    {
        $model = $this->repository->find($id);

        if (! $model || (! $admin && $model->user_id !== $userId)) {
            throw new InvalidArgumentException('Review tidak ditemukan.');
        }

        $this->repository->delete($model);
    }
}
