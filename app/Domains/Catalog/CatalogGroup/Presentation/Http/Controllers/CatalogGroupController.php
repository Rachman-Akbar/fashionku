<?php

namespace App\Domains\Catalog\CatalogGroup\Presentation\Http\Controllers;

use App\Domains\Catalog\CatalogGroup\Application\Dtos\CatalogGroupData;
use App\Domains\Catalog\CatalogGroup\Application\Queries\GetCatalogGroupBySlugQuery;
use App\Domains\Catalog\CatalogGroup\Application\Queries\GetCatalogGroupIdQuery;
use App\Domains\Catalog\CatalogGroup\Application\Queries\GetCatalogGroupsQuery;
use App\Domains\Catalog\CatalogGroup\Application\Queries\GetCategoriesByCatalogGroupQuery;
use App\Domains\Catalog\CatalogGroup\Application\UseCases\CreateCatalogGroupUseCase;
use App\Domains\Catalog\CatalogGroup\Application\UseCases\DeleteCatalogGroupUseCase;
use App\Domains\Catalog\CatalogGroup\Application\UseCases\UpdateCatalogGroupUseCase;
use App\Domains\Catalog\CatalogGroup\Presentation\Http\Requests\CatalogGroupRequest;
use App\Domains\Catalog\CatalogGroup\Presentation\Http\Resources\CatalogGroupResource;
use App\Domains\Catalog\Category\Presentation\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class CatalogGroupController extends Controller
{
    public function index(Request $request, GetCatalogGroupsQuery $query): JsonResponse
    {
        $groups = $query->execute($request->query());

        return response()->json([
            'success' => true,
            'data' => CatalogGroupResource::collection($groups),
        ]);
    }

    public function manage(Request $request, GetCatalogGroupsQuery $query): JsonResponse
    {
        $groups = $query->execute($request->query(), true);

        return response()->json([
            'success' => true,
            'data' => CatalogGroupResource::collection($groups),
        ]);
    }

    public function show(GetCatalogGroupIdQuery $query, int $id): JsonResponse
    {
        $group = $query->execute($id);

        if (! $group) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog group not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CatalogGroupResource($group),
        ]);
    }

    public function store(CreateCatalogGroupUseCase $useCase, CatalogGroupRequest $request): JsonResponse
    {
        $group = $useCase->execute(
            CatalogGroupData::fromArray($request->validated())
        );

        return response()->json([
            'success' => true,
            'data' => new CatalogGroupResource($group),
            'message' => 'Catalog group created successfully',
        ], 201);
    }

    public function update(UpdateCatalogGroupUseCase $useCase, CatalogGroupRequest $request, int $id): JsonResponse
    {
        $group = $useCase->execute(
            $id,
            CatalogGroupData::fromArray($request->validated())
        );

        if (! $group) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CatalogGroupResource($group),
            'message' => 'Catalog group updated successfully',
        ]);
    }

    public function categories(GetCategoriesByCatalogGroupQuery $query, int $id): JsonResponse
    {
        $categories = $query->execute($id);

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    public function showBySlug(GetCatalogGroupBySlugQuery $query, string $slug): JsonResponse
    {
        $group = $query->execute($slug);

        if (! $group) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog group not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CatalogGroupResource($group),
        ]);
    }

    public function destroy(DeleteCatalogGroupUseCase $useCase, int $id): JsonResponse
    {
        $deleted = $useCase->execute($id);

        if (! $deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog group not found or failed to delete',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Catalog group deleted successfully',
        ]);
    }
}
