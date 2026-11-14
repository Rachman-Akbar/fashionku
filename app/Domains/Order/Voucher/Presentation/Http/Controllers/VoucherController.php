<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Presentation\Http\Controllers;

use App\Domains\Order\Voucher\Application\DTOs\VoucherDTO;
use App\Domains\Order\Voucher\Application\UseCases\ManageVoucherUseCase;
use App\Domains\Order\Voucher\Application\UseCases\UserVoucherUseCase;
use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Order\Voucher\Presentation\Http\Requests\StoreVoucherRequest;
use App\Domains\Order\Voucher\Presentation\Http\Resources\MyVoucherResource;
use App\Domains\Order\Voucher\Presentation\Http\Resources\VoucherResource;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

final class VoucherController extends Controller
{
    public function __construct(
        private ManageVoucherUseCase $useCase,
        private UserVoucherUseCase $userVoucherUseCase,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'active_now' => true,
            'is_active' => true,
        ];

        $vouchers = $this->useCase->listVouchers($filters);
        $authUser = auth('sanctum')->user();
        $userId = $authUser?->getAuthIdentifier();

        $missionRewardIds = [];

        $ownedVoucherIds = $userId === null
            ? []
            : DB::table('user_vouchers')
                ->where('user_id', $userId)
                ->where('status', 'available')
                ->pluck('voucher_id')
                ->map(fn (mixed $value): int => (int) $value)
                ->flip()
                ->all();

        $request->attributes->set('voucher_ownership', [
            'mission_reward_ids' => $missionRewardIds,
            'owned_ids' => $ownedVoucherIds,
        ]);

        return response()->json([
            'success' => true,
            'data' => VoucherResource::collection($vouchers),
        ]);
    }

    public function myVouchers(Request $request): JsonResponse
    {
        $userId = (string) $request->user()->getAuthIdentifier();
        $perPage = max(1, min(100, (int) $request->query('per_page', 15)));

        $rows = $this->userVoucherUseCase->paginateForUser($userId, $perPage);

        return $this->paginated($rows);
    }

    public function claim(Request $request, int $id): JsonResponse
    {
        try {
            $userId = (string) $request->user()->getAuthIdentifier();
            $voucher = $this->userVoucherUseCase->claim($userId, $id);

            return response()->json([
                'success' => true,
                'message' => 'Voucher berhasil diklaim.',
                'data' => new MyVoucherResource($voucher),
            ]);
        } catch (ModelNotFoundException) {
            return response()->json(['success' => false, 'message' => 'Voucher tidak ditemukan.'], 404);
        } catch (Throwable $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function manage(Request $request): JsonResponse
    {
        $filters = [
            'include_inactive' => true,
            'active_now' => $request->boolean('active_now', false),
        ];

        if ($request->has('is_active')) {
            $filters['is_active'] = $request->boolean('is_active');
        }

        return response()->json([
            'success' => true,
            'data' => VoucherResource::collection($this->useCase->listVouchers($filters)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        try {
            return response()->json(['success' => true, 'data' => new VoucherResource($this->useCase->showVoucher($id, false))]);
        } catch (Throwable $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function store(StoreVoucherRequest $request): JsonResponse
    {
        try {
            $voucher = $this->useCase->createVoucher(new VoucherDTO(...$this->prepareData($request)));

            return response()->json([
                'success' => true,
                'message' => 'Voucher berhasil dibuat.',
                'data' => new VoucherResource($voucher),
            ], 201);
        } catch (Throwable $exception) {
            $this->deleteUploadedImage($request->attributes->get('uploaded_voucher_image'));

            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function update(int $id, StoreVoucherRequest $request): JsonResponse
    {
        $oldImage = null;

        try {
            $current = $this->useCase->showVoucher($id, true);
            $oldImage = $current->image;
            $voucher = $this->useCase->updateVoucher($id, new VoucherDTO(...$this->prepareData($request, $current)));

            if ($voucher->image && $oldImage && $voucher->image !== $oldImage) {
                $this->deleteUploadedImage($oldImage);
            }

            return response()->json(['success' => true, 'message' => 'Voucher berhasil diperbarui.', 'data' => new VoucherResource($voucher)]);
        } catch (Throwable $exception) {
            $this->deleteUploadedImage($request->attributes->get('uploaded_voucher_image'));

            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $voucher = $this->useCase->showVoucher($id, true);
            $image = $voucher->image;
            $this->useCase->deleteVoucher($id);
            $this->deleteUploadedImage($image);

            return response()->json(['success' => true, 'message' => 'Voucher berhasil dihapus.']);
        } catch (Throwable $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    private function prepareData(StoreVoucherRequest $request, ?Voucher $current = null): array
    {
        $data = $request->validated();

        $data['is_active'] = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : ($current?->is_active ?? true);
        $data['image'] = null;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('vouchers', 'public');
            $request->attributes->set('uploaded_voucher_image', $data['image']);
        }

        return [
            'code' => (string) $data['code'],
            'name' => (string) $data['name'],
            'discount_target' => (string) $data['discount_target'],
            'discount_type' => (string) $data['discount_type'],
            'discount_value' => (float) $data['discount_value'],
            'min_spend' => (float) $data['min_spend'],
            'min_items' => isset($data['min_items']) && $data['min_items'] !== '' ? (int) $data['min_items'] : null,
            'min_distinct_products' => isset($data['min_distinct_products']) && $data['min_distinct_products'] !== '' ? (int) $data['min_distinct_products'] : null,
            'terms' => isset($data['terms']) && trim((string) $data['terms']) !== '' ? trim((string) $data['terms']) : null,
            'max_discount' => isset($data['max_discount']) && $data['max_discount'] !== '' ? (float) $data['max_discount'] : null,
            'starts_at' => (string) $data['starts_at'],
            'ends_at' => (string) $data['ends_at'],
            'usage_limit' => (int) $data['usage_limit'],
            'is_active' => (bool) $data['is_active'],
            'image' => $data['image'],
        ];
    }

    private function paginated($paginator): JsonResponse
    {
        $resource = MyVoucherResource::collection($paginator)->response()->getData(true);

        return response()->json(array_merge(['success' => true], $resource));
    }

    private function deleteUploadedImage(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
