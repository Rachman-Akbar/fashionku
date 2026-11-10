<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Presentation\Http\Controllers;

use App\Domains\Catalog\CatalogGroup\Presentation\Http\Resources\CatalogGroupResource;
use App\Domains\Catalog\Category\Application\Queries\GetCategoryByIdQuery;
use App\Domains\Catalog\Category\Application\Queries\GetCategoryByPathQuery;
use App\Domains\Catalog\Category\Application\Queries\GetHeaderMenuQuery;
use App\Domains\Catalog\Category\Application\Queries\ListCategoryMenuQuery;
use App\Domains\Catalog\Category\Application\Queries\ListCategoryQuery;
use App\Domains\Catalog\Category\Application\Queries\ListProductsByCategoryPathQuery;
use App\Domains\Catalog\Category\Application\UseCases\CreateCategoryUseCase;
use App\Domains\Catalog\Category\Application\UseCases\DeleteCategoryUseCase;
use App\Domains\Catalog\Category\Application\UseCases\UpdateCategoryUseCase;
use App\Domains\Catalog\Category\Presentation\Http\Requests\CategoryRequest;
use App\Domains\Catalog\Category\Presentation\Http\Resources\CategoryResource;
use App\Domains\Catalog\Product\Presentation\Http\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use InvalidArgumentException;

final class CategoryController extends Controller
{
    public function index(ListCategoryQuery $query): JsonResponse
    {
        $categories = $query->execute();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function manage(ListCategoryQuery $query): JsonResponse
    {
        $categories = $query->execute(true);

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function menu(ListCategoryMenuQuery $query): JsonResponse
    {
        $categories = $query->execute();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function show(int $id, GetCategoryByIdQuery $query): JsonResponse
    {
        $category = $query->execute($id);

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ]);
    }

    public function store(CategoryRequest $request, CreateCategoryUseCase $useCase): JsonResponse
    {
        try {
            $category = $useCase->execute($request->toData());

            return response()->json([
                'success' => true,
                'data' => new CategoryResource($category),
                'message' => 'Category created successfully',
            ], 201);
        } catch (InvalidArgumentException $exception) {
            return $this->unprocessable($exception);
        }
    }

    public function update(
        int $id,
        CategoryRequest $request,
        UpdateCategoryUseCase $useCase
    ): JsonResponse {
        try {
            $category = $useCase->execute($id, $request->toData());

            if (! $category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new CategoryResource($category),
                'message' => 'Category updated successfully',
            ]);
        } catch (InvalidArgumentException $exception) {
            return $this->unprocessable($exception);
        }
    }

    public function destroy(int $id, DeleteCategoryUseCase $useCase): JsonResponse
    {
        $deleted = $useCase->execute($id);

        if (! $deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    public function headerMenu(GetHeaderMenuQuery $query): JsonResponse
    {
        $catalogGroups = $query->execute();

        return response()->json([
            'success' => true,
            'data' => CatalogGroupResource::collection($catalogGroups),
        ]);
    }

    public function showByPath(string $path, GetCategoryByPathQuery $query): JsonResponse
    {
        $category = $query->execute($path);

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ]);
    }

    public function productsByPath(
        string $path,
        Request $request,
        ListProductsByCategoryPathQuery $query
    ) {
        $products = $query->execute($path, $request->all());

        return ProductResource::collection($products)->additional([
            'success' => true,
        ]);
    }

    private function unprocessable(InvalidArgumentException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $exception->getMessage(),
        ], 422);
    }
}
