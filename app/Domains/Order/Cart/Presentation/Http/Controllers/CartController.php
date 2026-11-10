<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Presentation\Http\Controllers;

use App\Domains\Order\Cart\Application\DTOs\AddCartItemData;
use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Application\DTOs\UpdateCartItemData;
use App\Domains\Order\Cart\Application\UseCases\AddItemToCartUseCase;
use App\Domains\Order\Cart\Application\UseCases\ClearCartUseCase;
use App\Domains\Order\Cart\Application\UseCases\GetCartUseCase;
use App\Domains\Order\Cart\Application\UseCases\RemoveItemFromCartUseCase;
use App\Domains\Order\Cart\Application\UseCases\UpdateCartItemQuantityUseCase;
use App\Domains\Order\Cart\Presentation\Http\Requests\AddCartItemRequest;
use App\Domains\Order\Cart\Presentation\Http\Requests\UpdateCartItemRequest;
use App\Domains\Order\Cart\Presentation\Http\Resources\CartResource;
use App\Http\Controllers\Controller;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;

final class CartController extends Controller
{
    public function __construct(
        private readonly GetCartUseCase $getCart,
        private readonly AddItemToCartUseCase $addItem,
        private readonly UpdateCartItemQuantityUseCase $updateItem,
        private readonly RemoveItemFromCartUseCase $removeItem,
        private readonly ClearCartUseCase $clearCart,
    ) {}

    public function show(Request $request): JsonResponse
    {
        return $this->respond(fn (): CartSummaryData => $this->getCart->execute($this->userId($request)));
    }

    public function store(AddCartItemRequest $request): JsonResponse
    {
        return $this->respond(fn (): CartSummaryData => DB::transaction(function () use ($request): CartSummaryData {
            $userId = $this->userId($request);
            $summary = null;

            foreach ($request->validated('items') as $item) {
                $summary = $this->addItem->execute(new AddCartItemData(
                    userId: $userId,
                    productVariantId: (int) $item['product_variant_id'],
                    quantity: (int) $item['quantity']
                ));
            }

            return $summary ?? $this->getCart->execute($userId);
        }));
    }

    public function update(UpdateCartItemRequest $request, int|string $productVariantId): JsonResponse
    {
        return $this->respond(fn (): CartSummaryData => $this->updateItem->execute(new UpdateCartItemData(
            userId: $this->userId($request),
            productVariantId: (int) $productVariantId,
            quantity: (int) $request->validated('quantity'),
        )));
    }

    public function destroy(Request $request, int|string $productVariantId): JsonResponse
    {
        return $this->respond(fn (): CartSummaryData => $this->removeItem->execute(
            userId: $this->userId($request),
            productVariantId: (int) $productVariantId,
        ));
    }

    public function clear(Request $request): JsonResponse
    {
        return $this->respond(fn (): CartSummaryData => $this->clearCart->execute($this->userId($request)));
    }

    private function respond(callable $callback): JsonResponse
    {
        try {
            $summary = $callback();

            return CartResource::make($summary->toArray())->response();
        } catch (DomainException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    private function userId(Request $request): string
    {
        return (string) $request->user()->getAuthIdentifier();
    }
}
