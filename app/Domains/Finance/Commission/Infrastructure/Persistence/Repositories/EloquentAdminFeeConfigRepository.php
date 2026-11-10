<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Infrastructure\Persistence\Repositories;

use App\Domains\Finance\Commission\Domain\Entities\AdminFeeConfig;
use App\Domains\Finance\Commission\Domain\Repositories\AdminFeeConfigRepositoryInterface;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Models\AdminFeeConfigModel;

class EloquentAdminFeeConfigRepository implements AdminFeeConfigRepositoryInterface
{
    public function findById(int $id): ?AdminFeeConfig
    {
        $model = AdminFeeConfigModel::find($id);

        return $model ? $this->toEntity($model) : null;
    }

    public function findByCategoryId(?int $categoryId): ?AdminFeeConfig
    {
        $model = AdminFeeConfigModel::where('category_id', $categoryId)
            ->where('is_active', true)
            ->first();

        return $model ? $this->toEntity($model) : null;
    }

    public function findDefault(): ?AdminFeeConfig
    {
        $model = AdminFeeConfigModel::whereNull('category_id')
            ->where('is_active', true)
            ->first();

        return $model ? $this->toEntity($model) : null;
    }

    public function getActive(): array
    {
        return AdminFeeConfigModel::where('is_active', true)
            ->orderBy('category_id')
            ->get()
            ->map(fn ($model) => $this->toEntity($model))
            ->all();
    }

    public function create(array $data): AdminFeeConfig
    {
        $model = AdminFeeConfigModel::create($data);

        return $this->toEntity($model);
    }

    public function update(int $id, array $data): AdminFeeConfig
    {
        $model = AdminFeeConfigModel::findOrFail($id);
        $model->update($data);

        return $this->toEntity($model->fresh());
    }

    public function delete(int $id): void
    {
        AdminFeeConfigModel::findOrFail($id)->delete();
    }

    private function toEntity(AdminFeeConfigModel $model): AdminFeeConfig
    {
        return new AdminFeeConfig(
            id: $model->id,
            categoryId: $model->category_id,
            name: $model->name,
            code: $model->code,
            percentage: (float) $model->percentage,
            fixedAmount: (float) $model->fixed_amount,
            minFee: (float) $model->min_fee,
            maxFee: (float) $model->max_fee,
            isActive: (bool) $model->is_active,
            description: $model->description,
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString(),
        );
    }
}
