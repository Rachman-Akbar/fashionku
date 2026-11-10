<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Infrastructure\Persistence\Mappers;

use App\Domains\Order\Cart\Domain\Entities\Cart;
use App\Domains\Order\Cart\Domain\Entities\CartItem;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;

final class CartMapper
{
    public static function toDomain(CartModel $model): Cart
    {
        $domainItems = [];

        foreach ($model->items as $itemModel) {
            $domainItems[] = new CartItem(
                id: (int) $itemModel->id,
                productVariantId: (int) $itemModel->product_variant_id,
                quantity: (int) $itemModel->quantity
            );
        }

        return new Cart(
            id: (int) $model->id,
            userId: (string) $model->user_id,
            items: $domainItems
        );
    }
}
