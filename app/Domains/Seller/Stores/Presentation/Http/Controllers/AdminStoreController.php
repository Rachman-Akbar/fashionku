<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Presentation\Http\Controllers;

use App\Domains\Seller\Stores\Application\Queries\ListStoreQuery;
use App\Domains\Seller\Stores\Application\UseCases\UpdateStoreUseCase;
use App\Domains\Seller\Stores\Presentation\Http\Resources\StoreListResource;
use App\Domains\Seller\Stores\Presentation\Http\Resources\StoreResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;

final class AdminStoreController extends Controller
{
    public function index(Request $request, ListStoreQuery $query): AnonymousResourceCollection
    {
        return StoreListResource::collection($query->execute($request->query()));
    }

    public function update(Request $request, int $id, UpdateStoreUseCase $useCase): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'city' => ['nullable', 'string', 'max:80'],
            'province' => ['nullable', 'string', 'max:80'],
            'status' => ['sometimes', Rule::in(['approved', 'suspended'])],
            'is_active' => ['sometimes', 'boolean'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        $payload = [
            'store_name' => $data['name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'city' => $data['city'] ?? null,
            'province' => $data['province'] ?? null,
            'status' => $data['status'] ?? null,
            'is_active' => $data['is_active'] ?? null,
        ];
        $payload = array_filter($payload, fn (mixed $value): bool => $value !== null);

        $store = $useCase->execute($id, (string) $request->user()->id, 'admin', $payload);

        return (new StoreResource($store))
            ->additional(['message' => 'Toko berhasil diperbarui.'])
            ->response();
    }
}
