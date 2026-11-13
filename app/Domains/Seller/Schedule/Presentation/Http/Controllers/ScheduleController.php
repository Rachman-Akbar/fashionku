<?php

declare(strict_types=1);

namespace App\Domains\Seller\Schedule\Presentation\Http\Controllers;

use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

final class ScheduleController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->sellerStoreScope($request);

        $query = DB::table('schedules')
            ->whereNull('deleted_at')
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
            ->when($request->filled('date'), fn ($q) => $q->where('date', $request->query('date')))
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->query('type')))
            ->when($request->filled('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc');

        $perPage = min(100, max(1, (int) $request->query('per_page', 20)));
        $rows = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $rows->items(),
            'meta' => [
                'current_page' => $rows->currentPage(),
                'per_page' => $rows->perPage(),
                'total' => $rows->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'type' => ['required', 'string', 'max:50'],
            'priority' => ['nullable', 'string', 'max:20'],
            'color' => ['nullable', 'string', 'max:20'],
            'date' => ['required', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'is_all_day' => ['nullable', 'boolean'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'metadata' => ['nullable', 'array'],
        ]);

        $storeId = $this->sellerStoreScope($request);
        $userId = (string) $request->user()->id;

        try {
            $id = DB::table('schedules')->insertGetId([
                'user_id' => $userId,
                'store_id' => $storeId,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'type' => $data['type'],
                'priority' => $data['priority'] ?? 'normal',
                'color' => $data['color'] ?? '#10B981',
                'date' => Carbon::parse($data['date'])->toDateString(),
                'start_time' => $data['start_time'] ?? null,
                'end_time' => $data['end_time'] ?? null,
                'is_all_day' => $data['is_all_day'] ?? false,
                'capacity' => $data['capacity'] ?? 1,
                'is_active' => $data['is_active'] ?? true,
                'metadata' => $data['metadata'] ? json_encode($data['metadata']) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Jadwal berhasil dibuat.',
                'data' => ['id' => $id],
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $storeId = $this->sellerStoreScope($request);

        $row = DB::table('schedules')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
            ->first();

        if (! $row) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $row,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $storeId = $this->sellerStoreScope($request);

        $exists = DB::table('schedules')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
            ->exists();

        if (! $exists) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:50'],
            'priority' => ['nullable', 'string', 'max:20'],
            'color' => ['nullable', 'string', 'max:20'],
            'date' => ['nullable', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'is_all_day' => ['nullable', 'boolean'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['nullable', 'boolean'],
            'metadata' => ['nullable', 'array'],
            'is_completed' => ['nullable', 'boolean'],
        ]);

        $updateData = [];
        foreach (['title', 'description', 'type', 'priority', 'color', 'start_time', 'end_time', 'is_all_day', 'capacity', 'is_active', 'metadata', 'is_completed'] as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        if (isset($data['date'])) {
            $updateData['date'] = Carbon::parse($data['date'])->toDateString();
        }

        if (isset($data['metadata'])) {
            $updateData['metadata'] = json_encode($data['metadata']);
        }

        $updateData['updated_at'] = now();

        DB::table('schedules')
            ->where('id', $id)
            ->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil diperbarui.',
            'data' => ['id' => $id],
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $storeId = $this->sellerStoreScope($request);

        $deleted = DB::table('schedules')
            ->where('id', $id)
            ->whereNull('deleted_at')
            ->when($storeId, fn ($q) => $q->where('store_id', $storeId))
            ->update(['deleted_at' => now(), 'updated_at' => now()]);

        if (! $deleted) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil dihapus.',
            'data' => ['id' => $id],
        ]);
    }

    private function sellerStoreScope(Request $request): ?int
    {
        return $this->hasActiveRole($request, 'seller') ? $this->resolveSellerStoreId($request) : null;
    }
}
