<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Controllers;

use App\Domains\Catalog\Product\Application\Query\Product\GetProductBySlugQuery;
use App\Domains\Catalog\Product\Application\Query\Product\GetProductQuery;
use App\Domains\Catalog\Product\Application\Query\Product\ListProductsQuery;
use App\Domains\Catalog\Product\Application\Query\Product\ListSellerProductsQuery;
use App\Domains\Catalog\Product\Application\UseCases\Product\CreateProductUseCase;
use App\Domains\Catalog\Product\Application\UseCases\Product\DeleteProductUseCase;
use App\Domains\Catalog\Product\Application\UseCases\Product\UpdateProductUseCase;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Catalog\Product\Presentation\Http\Requests\StoreProductRequest;
use App\Domains\Catalog\Product\Presentation\Http\Requests\UpdateProductRequest;
use App\Domains\Catalog\Product\Presentation\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

final class ProductController extends Controller
{
    private function resolveCurrentSellerId(Request $request): ?string
    {
        $userId = $request->user()?->id;

        return $userId ? (string) $userId : null;
    }

    private function resolveStoreIdBySellerId(string $sellerId): ?int
    {
        $storeId = DB::table('stores')->where('user_id', $sellerId)->value('id');

        return $storeId ? (int) $storeId : null;
    }

    public function index(Request $request, ListProductsQuery $query, ProductRepositoryInterface $products)
    {
        $filters = $request->all();

        return ProductResource::collection($query->execute($filters))
            ->additional(['facets' => $products->facets($filters)]);
    }

    public function showBySlug(string $slug, GetProductBySlugQuery $query)
    {
        $product = $query->execute($slug);
        if (! $product) {
            return response()->json(['message' => "Produk dengan slug '{$slug}' tidak ditemukan."], 404);
        }

        return new ProductResource($product);
    }

    public function show(int $id, GetProductQuery $query)
    {
        $product = $query->execute($id);
        if (! $product) {
            return response()->json(['message' => "Produk dengan ID {$id} tidak ditemukan."], 404);
        }

        return new ProductResource($product);
    }

    public function sellerIndex(Request $request, ListSellerProductsQuery $query)
    {
        $sellerId = $this->resolveCurrentSellerId($request);
        if (! $sellerId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $products = $query->execute(
            sellerId: $sellerId,
            filters: $request->all()
        );

        return ProductResource::collection($products);
    }

    public function adminIndex(Request $request, ProductRepositoryInterface $products)
    {
        $filters = $request->all();
        $filters['include_inactive'] = true;
        $perPage = max(1, min(100, (int) ($filters['per_page'] ?? 20)));
        $page = max(1, (int) ($filters['page'] ?? 1));

        return ProductResource::collection($products->paginate($filters, $perPage, $page));
    }

    public function adminStore(StoreProductRequest $request, CreateProductUseCase $useCase)
    {
        try {
            return new ProductResource($useCase->execute($request->validated()));
        } catch (\InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function adminUpdate(
        UpdateProductRequest $request,
        int $id,
        GetProductQuery $query,
        UpdateProductUseCase $useCase
    ) {
        if (! $query->execute($id, true)) {
            return response()->json(['message' => "Produk dengan ID {$id} tidak ditemukan."], 404);
        }

        try {
            return new ProductResource($useCase->execute($id, $request->validated()));
        } catch (\InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function adminDestroy(int $id, GetProductQuery $query, DeleteProductUseCase $useCase)
    {
        if (! $query->execute($id, true)) {
            return response()->json(['message' => "Produk dengan ID {$id} tidak ditemukan."], 404);
        }

        $useCase->execute($id);

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }

    public function store(StoreProductRequest $request, CreateProductUseCase $useCase)
    {
        $sellerId = $this->resolveCurrentSellerId($request);
        if (! $sellerId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $payload = $request->validated();
        unset($payload['store_id']);
        $payload['seller_id'] = $sellerId;

        try {
            $product = $useCase->execute($payload);

            return new ProductResource($product);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function update(UpdateProductRequest $request, int $id, GetProductQuery $query, UpdateProductUseCase $useCase)
    {
        $sellerId = $this->resolveCurrentSellerId($request);
        if (! $sellerId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $product = $query->execute($id, true);
        if (! $product) {
            return response()->json(['message' => "Produk dengan ID {$id} tidak ditemukan."], 404);
        }

        $storeId = $this->resolveStoreIdBySellerId($sellerId);
        if ($product->storeId() !== $storeId) {
            return response()->json(['message' => 'Forbidden. Produk ini bukan milik toko Anda.'], 403);
        }

        $payload = $request->validated();
        unset($payload['seller_id'], $payload['store_id']);

        if (isset($payload['sku'])) {
            $payload['sku'] = is_string($payload['sku']) ? trim($payload['sku']) : $payload['sku'];
            if ($payload['sku'] === '') {
                unset($payload['sku']);
            }
        }

        $updated = $useCase->execute($id, $payload);

        return new ProductResource($updated);
    }

    public function destroy(Request $request, int $id, GetProductQuery $query, DeleteProductUseCase $useCase)
    {
        $sellerId = $this->resolveCurrentSellerId($request);
        if (! $sellerId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $product = $query->execute($id, true);
        if (! $product) {
            return response()->json(['message' => "Produk dengan ID {$id} tidak ditemukan."], 404);
        }

        $storeId = $this->resolveStoreIdBySellerId($sellerId);
        if ($product->storeId() !== $storeId) {
            return response()->json(['message' => 'Forbidden. Produk ini bukan milik toko Anda.'], 403);
        }

        $useCase->execute($id);

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}
