<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Presentation\Http\Controllers;

use App\Domains\Admin\Notification\Application\Services\AdminNotificationService;
use App\Domains\Admin\Notification\Presentation\Http\Resources\AdminNotificationResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AdminNotificationController extends Controller
{
    public function __construct(private AdminNotificationService $service) {}

    public function index(Request $request): JsonResponse
    {
        $rows = $this->service->paginate(
            (string) $request->user()->id,
            $request->only(['module', 'unread']),
            min(100, max(1, (int) $request->query('per_page', 20)))
        );

        return AdminNotificationResource::collection($rows)
            ->additional([
                'success' => true,
                'state' => $this->service->state((string) $request->user()->id),
            ])
            ->response();
    }

    public function state(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->state((string) $request->user()->id),
        ]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $row = $this->service->markRead($id, (string) $request->user()->id);

        return (new AdminNotificationResource($row))->additional([
            'success' => true,
            'state' => $this->service->state((string) $request->user()->id),
        ])->response();
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module' => ['nullable', 'string', 'max:80'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->service->markAllRead(
                (string) $request->user()->id,
                isset($validated['module']) ? trim((string) $validated['module']) : null
            ),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $this->service->delete($id, (string) $request->user()->id);
        } catch (\InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 404);
        }

        return response()->json([
            'success' => true,
            'data' => ['deleted' => true],
            'state' => $this->service->state((string) $request->user()->id),
        ]);
    }

    public function destroyAll(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module' => ['nullable', 'string', 'max:80'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $this->service->deleteAll(
                (string) $request->user()->id,
                isset($validated['module']) ? trim((string) $validated['module']) : null
            ),
        ]);
    }
}
