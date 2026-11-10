<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Controllers;

use App\Domains\Catalog\Product\Application\Query\Product\GetProductQuery;
use App\Domains\Catalog\Product\Application\Query\ProductVariant\GetProductVariantQuery;
use App\Domains\Catalog\Product\Application\Query\ProductVariant\ListProductVariantsQuery;
use App\Domains\Catalog\Product\Application\UseCases\ProductVariant\CreateProductVariantUseCase;
use App\Domains\Catalog\Product\Application\UseCases\ProductVariant\DeleteProductVariantUseCase;
use App\Domains\Catalog\Product\Application\UseCases\ProductVariant\UpdateProductVariantUseCase;
use App\Domains\Catalog\Product\Presentation\Http\Requests\StoreProductVariantRequest;
use App\Domains\Catalog\Product\Presentation\Http\Requests\UpdateProductVariantRequest;
use App\Domains\Catalog\Product\Presentation\Http\Resources\ProductVariantResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

final class ProductVariantController extends Controller
{
    public function publicIndex(
        Request $request,
        int $productId,
        GetProductQuery $productQuery,
        ListProductVariantsQuery $query
    ) {
        $product = $productQuery->execute($productId);

        if (! $product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return ProductVariantResource::collection(
            $query->execute($productId, $request->all())
        );
    }

    public function index(
        Request $request,
        int $productId,
        GetProductQuery $productQuery,
        ListProductVariantsQuery $query
    ) {
        $this->assertSellerProduct($request, $productId, $productQuery);

        return ProductVariantResource::collection(
            $query->execute($productId, $request->all())
        );
    }

    public function store(
        StoreProductVariantRequest $request,
        int $productId,
        GetProductQuery $productQuery,
        CreateProductVariantUseCase $useCase
    ): ProductVariantResource {
        $this->assertSellerProduct($request, $productId, $productQuery);

        return new ProductVariantResource(
            $useCase->execute($productId, $request->validated())
        );
    }

    public function show(
        Request $request,
        int $productId,
        int $variantId,
        GetProductQuery $productQuery,
        GetProductVariantQuery $query
    ) {
        $this->assertSellerProduct($request, $productId, $productQuery);
        $variant = $query->execute($variantId);

        if (! $variant || $variant->productId() !== $productId) {
            return response()->json(['message' => 'Product variant not found.'], 404);
        }

        return new ProductVariantResource($variant);
    }

    public function update(
        UpdateProductVariantRequest $request,
        int $productId,
        int $variantId,
        GetProductQuery $productQuery,
        GetProductVariantQuery $query,
        UpdateProductVariantUseCase $useCase
    ) {
        $this->assertSellerProduct($request, $productId, $productQuery);
        $variant = $query->execute($variantId);

        if (! $variant || $variant->productId() !== $productId) {
            return response()->json(['message' => 'Product variant not found.'], 404);
        }

        return new ProductVariantResource(
            $useCase->execute($variantId, $request->validated())
        );
    }

    public function destroy(
        Request $request,
        int $productId,
        int $variantId,
        GetProductQuery $productQuery,
        GetProductVariantQuery $query,
        DeleteProductVariantUseCase $useCase
    ) {
        $this->assertSellerProduct($request, $productId, $productQuery);
        $variant = $query->execute($variantId);

        if (! $variant || $variant->productId() !== $productId) {
            return response()->json(['message' => 'Product variant not found.'], 404);
        }

        $useCase->execute($variantId);

        return response()->json(['message' => 'Product variant deleted successfully.']);
    }

    private function assertSellerProduct(
        Request $request,
        int $productId,
        GetProductQuery $query
    ): void {
        $product = $query->execute($productId, true);
        abort_if(! $product, 404, 'Product not found.');

        $user = $request->user();
        abort_if(! $user, 401, 'Unauthenticated.');

        $sellerStoreId = DB::table('stores')
            ->where('user_id', (string) $user->getAuthIdentifier())
            ->value('id');

        abort_if(
            $product->storeId() !== ($sellerStoreId ? (int) $sellerStoreId : null),
            303,
            'Forbidden. This product does not belong to your store.'
        );
    }
}
