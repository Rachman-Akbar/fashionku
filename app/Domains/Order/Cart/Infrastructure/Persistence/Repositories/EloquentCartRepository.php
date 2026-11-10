<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Infrastructure\Persistence\Repositories;

use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Domain\Entities\Cart;
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;
use App\Domains\Order\Cart\Domain\ValueObjects\Money;
use App\Domains\Order\Cart\Infrastructure\Persistence\Mappers\CartMapper;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartItemModel;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use Illuminate\Support\Facades\DB;

final class EloquentCartRepository implements CartRepositoryInterface
{
    public function __construct(
        private readonly ProductForCartReaderInterface $productReader
    ) {}

    public function findByUserId(string $userId): ?Cart
    {
        $cartModel = CartModel::with(['items'])->where('user_id', $userId)->first();

        if (! $cartModel) {
            return null;
        }

        return CartMapper::toDomain($cartModel);
    }

    public function createNewCart(string $userId): Cart
    {
        $cartModel = CartModel::create(['user_id' => $userId]);
        $cartModel->setRelation('items', collect());

        return CartMapper::toDomain($cartModel);
    }

    public function save(Cart $cart): void
    {
        DB::transaction(function () use ($cart): void {
            $cartModel = CartModel::firstOrCreate(['user_id' => $cart->getUserId()]);

            $activeVariantIds = [];

            foreach ($cart->getItems() as $item) {
                $activeVariantIds[] = $item->getProductVariantId();

                CartItemModel::updateOrCreate(
                    [
                        'cart_id' => $cartModel->id,
                        'product_variant_id' => $item->getProductVariantId(),
                    ],
                    [
                        'quantity' => $item->getQuantity(),
                    ]
                );
            }

            CartItemModel::where('cart_id', $cartModel->id)
                ->whereNotIn('product_variant_id', $activeVariantIds)
                ->delete();
        });
    }

    public function delete(string $userId): void
    {
        CartModel::where('user_id', $userId)->delete();
    }

    public function removeItem(string $userId, int $productVariantId): void
    {
        $cartModel = CartModel::where('user_id', $userId)->first();

        if ($cartModel) {
            CartItemModel::where('cart_id', $cartModel->id)
                ->where('product_variant_id', $productVariantId)
                ->delete();
        }
    }

    public function getSummary(string $userId): CartSummaryData
    {
        $cartModel = CartModel::where('user_id', $userId)->first();

        if (! $cartModel) {
            return new CartSummaryData([], 0, 0);
        }

        $itemModels = CartItemModel::where('cart_id', $cartModel->id)->get();

        $variantIds = $itemModels->pluck('product_variant_id')->map(fn (mixed $id): int => (int) $id)->all();
        $detailsMap = $this->productReader->getVariantsDetails($variantIds);

        $formattedItems = [];
        $totalItems = 0;
        $totalPrice = new Money(0);

        foreach ($itemModels as $itemModel) {
            $details = $detailsMap[(int) $itemModel->product_variant_id] ?? null;

            if (! $details) {
                continue;
            }

            $quantity = (int) $itemModel->quantity;
            $subtotal = $details->getPrice()->multiply($quantity);

            $totalItems += $quantity;
            $totalPrice = $totalPrice->add($subtotal);

            $formattedItems[] = [
                'cart_item_id' => (int) $itemModel->id,
                'variant_id' => $details->getId(),
                'product_id' => $details->getProductId(),
                'store_id' => $details->getStoreId(),
                'store_name' => $details->getStoreName(),
                'product_name' => $details->getProductName(),
                'name' => $details->getName(),
                'sku' => $details->getSku(),
                'price' => $details->getPrice()->getAmount(),
                'stock' => $details->getStock(),
                'weight' => $details->getWeight(),
                'thumbnail' => $details->getThumbnail(),
                'quantity' => $quantity,
                'subtotal' => $subtotal->getAmount(),
                'attributes' => $details->getAttributes(),
            ];
        }

        return new CartSummaryData($formattedItems, $totalItems, $totalPrice->getAmount());
    }
}
