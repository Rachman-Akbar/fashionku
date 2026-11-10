<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Presentation\Http\Controllers;

use App\Domains\Catalog\Banner\Application\Dtos\BannerData;
use App\Domains\Catalog\Banner\Application\Queries\GetBannerQuery;
use App\Domains\Catalog\Banner\Application\UseCases\DeleteBannerUseCase;
use App\Domains\Catalog\Banner\Application\UseCases\UpsertBannerUseCase;
use App\Domains\Catalog\Banner\Presentation\Http\Requests\BannerRequest;
use App\Domains\Catalog\Banner\Presentation\Http\Resources\BannerResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use RuntimeException;
use Throwable;

final class BannerController extends Controller
{
    public function index(Request $request, GetBannerQuery $query): JsonResponse
    {
        $storeId = $request->integer('store_id');

        if (! $storeId || ! DB::table('stores')->where('id', $storeId)->where('is_active', true)->exists()) {
            return response()->json(['data' => []]);
        }

        $banners = $query->execute($storeId);

        return response()->json(['data' => array_map(fn ($banner) => $banner->toArray(), $banners)]);
    }

    public function adminManage(Request $request, GetBannerQuery $query): JsonResponse
    {
        $banners = $query->executeAll($request->only(['search', 'store_id', 'is_active']));

        return response()->json(['data' => array_map(fn ($banner) => $banner->toArray(), $banners)]);
    }

    public function adminStore(BannerRequest $request, UpsertBannerUseCase $useCase): BannerResource
    {
        $payload = $request->validated();
        $payload['store_id'] = $this->requireAdminStoreId($payload);

        return new BannerResource($useCase->execute(BannerData::fromArray($payload)));
    }

    public function adminUpdate(BannerRequest $request, int $id, UpsertBannerUseCase $useCase): JsonResponse
    {
        $payload = $request->validated();
        $payload['store_id'] = $this->requireAdminStoreId($payload);

        try {
            $banner = $useCase->execute(BannerData::fromArray($payload), $id);

            return response()->json([
                'message' => 'Banner berhasil diperbarui.',
                'data' => $banner->toArray(),
            ]);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function adminDestroy(int $id, DeleteBannerUseCase $useCase): JsonResponse
    {
        try {
            $useCase->execute($id);

            return response()->json(['message' => 'Banner berhasil dihapus.']);
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 404);
        }
    }

    public function manage(Request $request, GetBannerQuery $query): JsonResponse
    {
        $banners = $query->execute($this->resolveSellerStoreId($request), true);

        return response()->json(['data' => array_map(fn ($banner) => $banner->toArray(), $banners)]);
    }

    public function store(BannerRequest $request, UpsertBannerUseCase $useCase): BannerResource
    {
        $payload = $request->validated();
        $payload['store_id'] = $this->resolveSellerStoreId($request);

        return new BannerResource($useCase->execute(BannerData::fromArray($payload)));
    }

    public function update(BannerRequest $request, int $id, UpsertBannerUseCase $useCase): JsonResponse
    {
        $payload = $request->validated();
        $payload['store_id'] = $this->resolveSellerStoreId($request);

        try {
            $banner = $useCase->execute(BannerData::fromArray($payload), $id);

            return response()->json([
                'message' => 'Banner toko berhasil diperbarui',
                'data' => $banner->toArray(),
            ]);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function destroy(Request $request, int $id, DeleteBannerUseCase $useCase): JsonResponse
    {
        try {
            $useCase->execute($id, $this->resolveSellerStoreId($request));

            return response()->json(['message' => 'Banner toko berhasil dihapus']);
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 404);
        }
    }

    private function requireAdminStoreId(array $payload): int
    {
        $storeId = (int) ($payload['store_id'] ?? 0);

        if ($storeId <= 0) {
            throw ValidationException::withMessages([
                'store_id' => ['Toko wajib dipilih.'],
            ]);
        }

        return $storeId;
    }

    private function resolveSellerStoreId(Request $request): int
    {
        $storeId = $request->user()?->store?->id;

        if (! $storeId) {
            throw new RuntimeException('Akun seller belum terhubung dengan toko aktif.');
        }

        return (int) $storeId;
    }
}
