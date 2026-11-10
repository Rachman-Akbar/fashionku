<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Presentation\Http\Controllers;

use App\Domains\Communication\Chat\Application\Services\ConversationService;
use App\Domains\Communication\Chat\Presentation\Http\Requests\ConversationRequest;
use App\Domains\Communication\Chat\Presentation\Http\Resources\ChatMessageResource;
use App\Domains\Communication\Chat\Presentation\Http\Resources\ConversationResource;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesActiveRole;
use App\Domains\Shared\Presentation\Http\Concerns\ResolvesSellerStoreContext;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use InvalidArgumentException;

final class ConversationController extends Controller
{
    use ResolvesActiveRole;
    use ResolvesSellerStoreContext;

    public function __construct(private ConversationService $service) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['type', 'store_id', 'search']);

        if ($this->hasActiveRole($request, 'seller')) {
            $filters['store_id'] = $this->resolveSellerStoreId($request);
        }

        $rows = $this->service->paginate(
            (string) $request->user()->id,
            $filters,
            min(100, max(1, (int) $request->query('per_page', 30))),
            $this->hasActiveRole($request, 'admin')
        );

        return ConversationResource::collection($rows)->additional(['success' => true])->response();
    }

    public function store(ConversationRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($this->hasActiveRole($request, 'seller')) {
            $data['type'] = 'store';
            $data['store_id'] = $this->resolveSellerStoreId($request);
            $data['order_id'] = null;
        }

        try {
            $row = $this->service->start(
                $data,
                (string) $request->user()->id,
                $this->hasActiveRole($request, 'admin')
            );

            return (new ConversationResource($row))->additional(['success' => true, 'message' => 'Percakapan berhasil dibuka.'])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $row = $this->service->find($id, (string) $request->user()->id, $this->hasActiveRole($request, 'admin'));
            $this->service->markRead($id, (string) $request->user()->id, $this->hasActiveRole($request, 'admin'));

            return (new ConversationResource($row))->additional(['success' => true])->response();
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function send(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'message_type' => ['nullable', Rule::in(['text', 'image', 'file'])],
            'message' => ['required', 'string', 'max:10000'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['string', 'max:2048'],
        ]);

        try {
            $row = $this->service->send($id, $validated, (string) $request->user()->id, $this->hasActiveRole($request, 'admin'));

            return (new ChatMessageResource($row))->additional(['success' => true])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        try {
            $this->service->markRead($id, (string) $request->user()->id, $this->hasActiveRole($request, 'admin'));

            return response()->json(['success' => true, 'message' => 'Pesan ditandai sudah dibaca.']);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 404);
        }
    }

    public function announce(Request $request): JsonResponse
    {
        abort_unless($this->hasActiveRole($request, 'admin'), 403, 'Hanya admin yang dapat mengirim announcement.');
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:180'],
            'message' => ['required', 'string', 'max:10000'],
            'target_role' => ['nullable', Rule::in(['seller', 'buyer'])],
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['uuid', 'distinct', 'exists:users,id'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['string', 'max:2048'],
        ]);

        try {
            $row = $this->service->announce($validated, (string) $request->user()->id);

            return (new ConversationResource($row))->additional(['success' => true, 'message' => 'Announcement berhasil dikirim.'])->response()->setStatusCode(201);
        } catch (InvalidArgumentException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }
}
