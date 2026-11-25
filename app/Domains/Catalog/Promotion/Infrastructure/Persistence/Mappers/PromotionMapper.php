<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Promotion\Domain\Entities\Promotion;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionModel;

final class PromotionMapper
{
    public static function toEntity(PromotionModel $model): Promotion
    {
        return new Promotion(
            id: (int) $model->id,
            name: (string) $model->name,
            imageUrl: (string) $model->image_url,
            mobileImageUrl: $model->mobile_image_url,
            clickAction: (string) $model->click_action,
            targetId: $model->target_id !== null ? (int) $model->target_id : null,
            targetUrl: $model->target_url,
            sortOrder: (int) $model->sort_order,
            isActive: (bool) $model->is_active,
            createdByUser: self::auditUser($model, 'created_by', 'creator'),
            updatedByUser: self::auditUser($model, 'updated_by', 'updater'),
            createdAt: $model->created_at?->toDateTimeString(),
            updatedAt: $model->updated_at?->toDateTimeString(),
        );
    }

    /**
     * Relasi user pada kolom audit ditampilkan sebagai nama, bukan UUID.
     */
    private static function auditUser(PromotionModel $model, string $column, string $relation): ?array
    {
        $id = $model->getAttribute($column);

        if ($id === null || $id === '') {
            return null;
        }

        return [
            'id' => (string) $id,
            'name' => $model->relationLoaded($relation) ? $model->{$relation}?->name : null,
        ];
    }
}
