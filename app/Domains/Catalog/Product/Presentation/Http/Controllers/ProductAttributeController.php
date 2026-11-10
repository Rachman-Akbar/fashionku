<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Presentation\Http\Controllers;

use App\Domains\Catalog\Product\Application\Query\ProductAttribute\GetProductAttributeQuery;
use App\Domains\Catalog\Product\Application\Query\ProductAttribute\ListProductAttributesQuery;
use App\Domains\Catalog\Product\Application\UseCases\ProductAttribute\CreateProductAttributeUseCase;
use App\Domains\Catalog\Product\Application\UseCases\ProductAttribute\DeleteProductAttributeUseCase;
use App\Domains\Catalog\Product\Application\UseCases\ProductAttribute\UpdateProductAttributeUseCase;
use App\Domains\Catalog\Product\Presentation\Http\Requests\StoreProductAttributeRequest;
use App\Domains\Catalog\Product\Presentation\Http\Requests\UpdateProductAttributeRequest;
use App\Domains\Catalog\Product\Presentation\Http\Resources\ProductAttributeResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class ProductAttributeController extends Controller
{
    public function index(Request $request, ListProductAttributesQuery $query)
    {
        $attributes = $query->execute($request->all());

        return ProductAttributeResource::collection($attributes);
    }

    public function store(StoreProductAttributeRequest $request, CreateProductAttributeUseCase $useCase)
    {
        $attribute = $useCase->execute($request->validated());

        return new ProductAttributeResource($attribute);
    }

    public function show(int $id, GetProductAttributeQuery $query)
    {
        $attribute = $query->execute($id);

        if (! $attribute) {
            return response()->json(['message' => 'Product attribute not found.'], 404);
        }

        return new ProductAttributeResource($attribute);
    }

    public function update(UpdateProductAttributeRequest $request, int $id, UpdateProductAttributeUseCase $useCase)
    {
        $attribute = $useCase->execute($id, $request->validated());

        return new ProductAttributeResource($attribute);
    }

    public function destroy(int $id, DeleteProductAttributeUseCase $useCase)
    {
        $useCase->execute($id);

        return response()->json(['message' => 'Product attribute deleted successfully.']);
    }
}
