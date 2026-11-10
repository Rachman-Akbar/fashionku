<?php

declare(strict_types=1);

namespace App\Domains\Order\Wishlist\Presentation\Http\Controllers;

use App\Domains\Order\Wishlist\Application\DTOs\WishlistInputDto;
use App\Domains\Order\Wishlist\Application\UseCases\AddItemToWishlistUseCase;
use App\Domains\Order\Wishlist\Application\UseCases\GetWishlistUseCase;
use App\Domains\Order\Wishlist\Application\UseCases\RemoveItemFromWishlistUseCase;
use App\Http\Controllers\Controller;
use DomainException;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class WishlistController extends Controller
{
    public function __construct(
        private readonly GetWishlistUseCase $getWishlistUseCase,
        private readonly AddItemToWishlistUseCase $addItemUseCase,
        private readonly RemoveItemFromWishlistUseCase $removeItemUseCase
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->getWishlistUseCase->execute($this->getAuthenticatedUserId()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where(
                    fn (Builder $query): Builder => $query
                        ->where('is_active', true)
                        ->where('status', 'published')
                        ->whereNull('deleted_at')
                ),
            ],
        ]);

        try {
            $dto = new WishlistInputDto(
                $this->getAuthenticatedUserId(),
                (int) $validated['product_id']
            );
            $this->addItemUseCase->execute($dto);

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan ke wishlist.',
            ], 201);
        } catch (DomainException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        }
    }

    public function destroy(int $productId): JsonResponse
    {
        try {
            $this->removeItemUseCase->execute(
                $this->getAuthenticatedUserId(),
                $productId
            );

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus dari wishlist.',
            ]);
        } catch (DomainException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        }
    }

    private function getAuthenticatedUserId(): string
    {
        $user = auth('sanctum')->user();

        if (! $user) {
            throw new HttpResponseException(
                response()->json(['message' => 'Unauthenticated.'], 401)
            );
        }

        return (string) $user->id;
    }
}
