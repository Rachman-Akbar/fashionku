<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Infrastructure\Persistence\Mappers;

use App\Domains\Catalog\Banner\Domain\Entities\Banner;
use App\Domains\Catalog\Banner\Infrastructure\Persistence\Models\BannerModel;

final class BannerMapper
{
    public static function toEntity(BannerModel $model): Banner
    {
        return new Banner(
            id: (int) $model->id,
            storeId: (int) $model->store_id,
            name: (string) $model->name,
            imageUrl: (string) $model->image_url,
            sortOrder: (int) $model->sort_order,
            isActive: (bool) $model->is_active
        );
    }
}
