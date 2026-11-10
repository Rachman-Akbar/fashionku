<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Presentation\Http\Controllers;

use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Domains\Support\Ticket\Application\Services\TicketService;
use App\Domains\Support\Ticket\Presentation\Http\Requests\TicketRequest;
use App\Domains\Support\Ticket\Presentation\Http\Resources\TicketResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use InvalidArgumentException;

final class TicketController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private TicketService $service) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->hasActiveRole($request, 'admin');
        $rows = $this->service->paginate(
            $request->only(['status', 'priority', 'category', 'search']),
            min(100, max(1, (int) $request->query('per_page', 20))),
            $isAdmin ? null : (string) $request->user()->id
        );

        return TicketResource::collection($rows)->additional(['success' => true])->response();
    }

    public function context(Request $request): JsonResponse
    {
        $role = $this->activeRole($request) ?: 'buyer';
        $storeId = $role === 'seller' ? $this->resolveSellerStoreId($request, false) : null;

        try {
            return response()->json([
                'success' => true,
                'data' => $this->service->context((string) $request->user()->id, $role, $storeId),
            ]);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function store(TicketRequest $request): JsonResponse
    {
        $role = $this->activeRole($request) ?: 'buyer';
        $storeId = $role === 'seller' ? $this->resolveSellerStoreId($request, false) : null;

        try {
            $row = $this->service->create(
                $request->validated(),
                (string) $request->user()->id,
                $role,
                $storeId
            );

            return (new TicketResource($row))->additional(['success' => true, 'message' => 'Help berhasil dibuat.'])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $ownerId = $this->hasActiveRole($request, 'admin') ? null : (string) $request->user()->id;

        try {
            return (new TicketResource($this->service->find($id, $ownerId)))->additional(['success' => true])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        abort_unless($this->hasActiveRole($request, 'admin'), 403, 'Hanya admin yang dapat mengubah status Help.');
        $validated = $request->validate([
            'status' => ['required', Rule::in(['open', 'in_progress', 'resolved', 'closed'])],
            'assigned_to' => ['nullable', 'uuid', 'exists:users,id'],
        ]);

        try {
            $row = $this->service->updateStatus($id, $validated, (string) $request->user()->id);

            return (new TicketResource($row))->additional(['success' => true, 'message' => 'Status Help berhasil diperbarui.'])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function reply(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:10000'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['string', 'max:2048'],
            'is_internal' => ['nullable', 'boolean'],
        ]);

        try {
            $row = $this->service->reply($id, $validated, (string) $request->user()->id, $this->hasActiveRole($request, 'admin'));

            return (new TicketResource($row))->additional(['success' => true, 'message' => 'Balasan berhasil dikirim.'])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        abort_unless($this->hasActiveRole($request, 'admin'), 403, 'Hanya admin yang dapat menghapus Help.');

        try {
            $this->service->delete($id);

            return response()->json(['success' => true, 'message' => 'Help berhasil dihapus.']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }
}
