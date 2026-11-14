<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Promotion\Domain\Entities\Promotion;
use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionRepositoryInterface;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Mappers\PromotionMapper;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

final class EloquentPromotionRepository implements PromotionRepositoryInterface
{
    public function getAll(array $filters = [], bool $includeInactive = false): array
    {
        return $this->applyFilters(PromotionModel::query(), $filters, $includeInactive)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (PromotionModel $model): Promotion => PromotionMapper::toEntity($model))
            ->all();
    }

    public function findById(int $id, bool $includeInactive = true): ?Promotion
    {
        $model = PromotionModel::query()
            ->when(! $includeInactive, fn (Builder $query) => $query->active())
            ->find($id);

        return $model ? PromotionMapper::toEntity($model) : null;
    }

    public function nameExists(string $name, ?int $ignoreId = null): bool
    {
        return PromotionModel::withTrashed()
            ->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])
            ->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getQualifiedKeyName(), '!=', $ignoreId))
            ->exists();
    }

    public function save(Promotion $promotion): Promotion
    {
        $model = $promotion->id
            ? PromotionModel::query()->findOrFail($promotion->id)
            : new PromotionModel;

        $model->fill([
            'promotion_payment_id' => $promotion->promotionPaymentId,
            'name' => $promotion->name,
            'image_url' => $promotion->imageUrl,
            'mobile_image_url' => $promotion->mobileImageUrl,
            'click_action' => $promotion->clickAction,
            'target_id' => $promotion->targetId,
            'target_url' => $promotion->targetUrl,
            'sort_order' => $promotion->sortOrder,
            'is_active' => $promotion->isActive,
        ])->save();

        return PromotionMapper::toEntity($model->refresh());
    }

    public function delete(int $id): bool
    {
        $model = PromotionModel::query()->find($id);

        return $model ? (bool) $model->delete() : false;
    }

    private function applyFilters(Builder $query, array $filters, bool $includeInactive): Builder
    {
        return $query
            ->when(! $includeInactive, fn (Builder $query) => $query->active())
            ->when(array_key_exists('is_active', $filters), fn (Builder $query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('target_url', 'like', "%{$search}%");
                });
            });
    }
}
