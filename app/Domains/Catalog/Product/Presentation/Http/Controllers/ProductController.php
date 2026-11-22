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
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Catalog\Product\Presentation\Http\Requests\StoreProductRequest;
use App\Domains\Catalog\Product\Presentation\Http\Requests\UpdateProductRequest;
use App\Domains\Catalog\Product\Presentation\Http\Resources\ProductResource;
use App\Domains\Shared\Codes\Application\Services\CodePatternFormatter;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class ProductController extends Controller
{
    private function resolveCurrentSellerId(Request $request): ?string
    {
        $userId = $request->user()?->id;

        return $userId ? (string) $userId : null;
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

        $payload = $request->validated();

        if (isset($payload['sku'])) {
            $payload['sku'] = is_string($payload['sku']) ? trim($payload['sku']) : $payload['sku'];
            if ($payload['sku'] === '') {
                unset($payload['sku']);
            }
        }

        $updated = $useCase->execute($id, $payload);

        return new ProductResource($updated);
    }

    /**
     * Membuat SKU custom dari rumus, mis. {BRAND}-{NAME:6}-{ATTR}-{SEQ:3}.
     * Dipakai frontend admin/seller untuk mengisi SKU produk maupun varian.
     */
    public function generateSku(Request $request, CodePatternService $patterns): JsonResponse
    {
        $validated = $request->validate([
            'pattern' => ['nullable', 'string', 'max:120'],
            'name' => ['nullable', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'attributes' => ['nullable', 'array'],
            'attributes.*' => ['nullable', 'string', 'max:255'],
            'variant_id' => ['nullable', 'integer'],
        ]);

        $pattern = CodePatternFormatter::sanitize((string) ($validated['pattern'] ?? ''));
        if ($pattern === '') {
            $pattern = $patterns->patternFor('sku');
        }

        $attributes = array_values(array_filter(array_map(
            fn ($value): string => trim((string) $value),
            $validated['attributes'] ?? []
        ), fn (string $value): bool => $value !== ''));

        $context = [
            'type' => 'SKU',
            'name' => (string) ($validated['name'] ?? ''),
            'brand' => (string) ($validated['brand'] ?? ''),
            'category' => (string) ($validated['category'] ?? ''),
            'attr' => implode('-', $attributes),
            'seq' => (int) DB::table('product_variants')->count() + 1,
        ];

        $isTaken = function (string $sku) use ($validated): bool {
            return ProductVariantModel::query()
                ->whereRaw('LOWER(TRIM(sku)) = ?', [Str::lower($sku)])
                ->when(! empty($validated['variant_id']), fn ($query) => $query->where('id', '!=', (int) $validated['variant_id']))
                ->exists();
        };

        $sku = CodePatternFormatter::render($pattern, $context);

        if ($isTaken($sku)) {
            $sequence = $context['seq'];

            for ($attempt = 0; $attempt < 50; $attempt++) {
                $candidate = CodePatternFormatter::render($pattern, array_merge($context, ['seq' => $sequence + $attempt + 1]));
                if (! $isTaken($candidate)) {
                    $sku = $candidate;
                    break;
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'sku' => $sku,
                'pattern' => $pattern,
            ],
        ]);
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

        $useCase->execute($id);

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}
