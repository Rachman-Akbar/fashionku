<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories;

use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeValueRepositoryInterface;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductAttributeValueModel;

final class EloquentProductAttributeValueRepository implements ProductAttributeValueRepositoryInterface
{
    public function replaceForProduct(int $productId, array $values): void
    {
        ProductAttributeValueModel::query()
            ->where('product_id', $productId)
            ->delete();

        foreach ($values as $value) {
            if (! isset($value['attribute_id']) || ! array_key_exists('value', $value)) {
                continue;
            }

            ProductAttributeValueModel::query()->create([
                'product_id' => $productId,
                'attribute_id' => (int) $value['attribute_id'],
                'value' => (string) $value['value'],
            ]);
        }
    }
}
