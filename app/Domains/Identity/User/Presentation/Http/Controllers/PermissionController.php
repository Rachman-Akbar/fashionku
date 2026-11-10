<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Controllers;

use App\Domains\Identity\User\Domain\Entities\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

final class PermissionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Permission::query()
                ->orderBy('name')
                ->get(['id', 'name', 'description', 'is_active'])
                ->map(fn (Permission $permission): array => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'description' => $permission->description,
                    'is_active' => (bool) $permission->is_active,
                ])
                ->values(),
        ]);
    }
}
