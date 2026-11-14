<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Presentation\Http\Controllers;

use App\Domains\Catalog\Promotion\Application\Dtos\PromotionData;
use App\Domains\Catalog\Promotion\Application\Queries\GetPromotionQuery;
use App\Domains\Catalog\Promotion\Application\UseCases\DeletePromotionUseCase;
use App\Domains\Catalog\Promotion\Application\UseCases\UpsertPromotionUseCase;
use App\Domains\Catalog\Promotion\Presentation\Http\Requests\PromotionRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use InvalidArgumentException;
use Throwable;

final class PromotionController extends Controller
{
    public function index(Request $request, GetPromotionQuery $query): JsonResponse
    {
        try {
            return response()->json([
                'data' => array_map(
                    fn (PromotionData $item): array => $this->present($item),
                    $query->execute($request->only(['search']), false)
                ),
            ]);
        } catch (Throwable $exception) {
            report($exception);

            try {
                $data = $this->legacyPublicPromotions();
            } catch (Throwable $fallbackException) {
                report($fallbackException);
                $data = [];
            }

            return response()->json([
                'data' => $data,
                'message' => 'Promosi dimuat menggunakan mode kompatibilitas. Jalankan migration terbaru untuk hasil penuh.',
            ], 200);
        }
    }

    public function manage(Request $request, GetPromotionQuery $query): JsonResponse
    {
        return response()->json([
            'data' => array_map(
                fn (PromotionData $item): array => $this->present($item),
                $query->execute($request->only(['search', 'is_active']), true)
            ),
        ]);
    }

    public function sellerManage(Request $request, GetPromotionQuery $query): JsonResponse
    {
        return $this->manage($request, $query);
    }

    public function store(PromotionRequest $request, UpsertPromotionUseCase $useCase): JsonResponse
    {
        return $this->upsert($request, $useCase);
    }

    public function sellerStore(PromotionRequest $request, UpsertPromotionUseCase $useCase): JsonResponse
    {
        return $this->upsert($request, $useCase);
    }

    public function update(PromotionRequest $request, int $id, UpsertPromotionUseCase $useCase): JsonResponse
    {
        return $this->upsert($request, $useCase, $id);
    }

    public function sellerUpdate(PromotionRequest $request, int $id, UpsertPromotionUseCase $useCase): JsonResponse
    {
        return $this->upsert($request, $useCase, $id);
    }

    public function destroy(int $id, DeletePromotionUseCase $useCase): JsonResponse
    {
        return $this->delete($id, $useCase);
    }

    public function sellerDestroy(int $id, DeletePromotionUseCase $useCase): JsonResponse
    {
        return $this->delete($id, $useCase);
    }

    private function upsert(PromotionRequest $request, UpsertPromotionUseCase $useCase, ?int $id = null): JsonResponse
    {
        try {
            $promotion = $useCase->execute(
                PromotionData::fromArray($request->validated()),
                $id
            );

            return response()->json([
                'message' => $id ? 'Promosi berhasil diperbarui.' : 'Promosi berhasil dibuat dan langsung disetujui.',
                'data' => $this->present($promotion),
            ], $id ? 200 : 201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    private function delete(int $id, DeletePromotionUseCase $useCase): JsonResponse
    {
        try {
            $useCase->execute($id);

            return response()->json(['message' => 'Promosi berhasil dihapus.']);
        } catch (Throwable $exception) {
            return response()->json(['message' => $exception->getMessage()], 404);
        }
    }

    private function present(PromotionData $promotion): array
    {
        $data = $promotion->toArray();
        $data['resolved_url'] = $this->resolveTargetUrl($promotion);

        return $data;
    }

    private function resolveTargetUrl(PromotionData $promotion): string
    {
        if ($promotion->clickAction === 'product' && $promotion->targetId && Schema::hasTable('products')) {
            $slug = DB::table('products')
                ->where('id', $promotion->targetId)
                ->where('is_active', true)
                ->where('status', 'published')
                ->whereNull('deleted_at')
                ->value('slug');

            return $slug ? '/products/'.$slug : '/promotions';
        }

        if ($promotion->clickAction === 'category' && $promotion->targetId && Schema::hasTable('categories')) {
            $slugColumn = Schema::hasColumn('categories', 'full_slug') ? 'full_slug' : 'slug';
            $categoryQuery = DB::table('categories')
                ->where('id', $promotion->targetId);

            if (Schema::hasColumn('categories', 'is_active')) {
                $categoryQuery->where('is_active', true);
            }

            if (Schema::hasColumn('categories', 'deleted_at')) {
                $categoryQuery->whereNull('deleted_at');
            }

            $slug = $categoryQuery->value($slugColumn);

            return $slug ? '/category/'.ltrim((string) $slug, '/') : '/promotions';
        }

        if ($promotion->clickAction === 'url' && $promotion->targetUrl) {
            return $promotion->targetUrl;
        }

        return '/promotions';
    }

    private function legacyPublicPromotions(): array
    {
        if (! Schema::hasTable('promotions')) {
            return [];
        }

        $columns = collect(Schema::getColumnListing('promotions'));
        $query = DB::table('promotions');

        if ($columns->contains('is_active')) {
            $query->where('is_active', true);
        }

        if ($columns->contains('deleted_at')) {
            $query->whereNull('deleted_at');
        }

        if ($columns->contains('sort_order')) {
            $query->orderBy('sort_order');
        }

        return $query->orderByDesc('id')->get()->map(function (object $row) use ($columns): array {
            $promotion = PromotionData::fromArray([
                'id' => $row->id ?? null,
                'name' => $columns->contains('name') ? ($row->name ?? 'promotion') : 'promotion '.($row->id ?? ''),
                'image_url' => $row->image_url ?? '',
                'mobile_image_url' => $columns->contains('mobile_image_url') ? ($row->mobile_image_url ?? null) : null,
                'click_action' => $row->click_action ?? 'none',
                'target_id' => $row->target_id ?? null,
                'target_url' => $row->target_url ?? null,
                'sort_order' => $row->sort_order ?? 0,
                'is_active' => $columns->contains('is_active') ? (bool) ($row->is_active ?? true) : true,
            ]);

            return $this->present($promotion);
        })->all();
    }
}
