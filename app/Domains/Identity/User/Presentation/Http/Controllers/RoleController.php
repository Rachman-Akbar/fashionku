<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Controllers;

use App\Domains\Identity\User\Application\DTOs\RoleData;
use App\Domains\Identity\User\Application\Queries\Role\GetRoleQuery;
use App\Domains\Identity\User\Application\Queries\Role\ListRolesQuery;
use App\Domains\Identity\User\Application\UseCases\Role\CreateRoleUseCase;
use App\Domains\Identity\User\Application\UseCases\Role\DeleteRoleUseCase;
use App\Domains\Identity\User\Application\UseCases\Role\UpdateRoleUseCase;
use App\Domains\Identity\User\Presentation\Http\Requests\RoleRequest;
use App\Domains\Identity\User\Presentation\Http\Resources\RoleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use InvalidArgumentException;

final class RoleController extends Controller
{
    public function index(Request $request, ListRolesQuery $query)
    {
        $perPage = min(100, max(1, $request->integer('per_page', 15)));

        return RoleResource::collection($query->execute($perPage));
    }

    public function show(int $id, GetRoleQuery $query): JsonResponse
    {
        $role = $query->execute($id);

        if (! $role) {
            return response()->json(['message' => 'Role tidak ditemukan.'], 404);
        }

        return response()->json(['data' => new RoleResource($role)]);
    }

    public function store(RoleRequest $request, CreateRoleUseCase $useCase): JsonResponse
    {
        try {
            return response()->json([
                'data' => new RoleResource($useCase->execute(RoleData::fromArray($request->validated()))),
            ], 201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function update(int $id, RoleRequest $request, UpdateRoleUseCase $useCase): JsonResponse
    {
        try {
            $role = $useCase->execute($id, RoleData::fromArray($request->validated()));

            if (! $role) {
                return response()->json(['message' => 'Role tidak ditemukan.'], 404);
            }

            return response()->json(['data' => new RoleResource($role)]);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function destroy(int $id, DeleteRoleUseCase $useCase): JsonResponse
    {
        if (! $useCase->execute($id)) {
            return response()->json(['message' => 'Role tidak ditemukan.'], 404);
        }

        return response()->json(['message' => 'Role berhasil dihapus.']);
    }
}
