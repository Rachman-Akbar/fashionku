<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Presentation\Http\Controllers;

use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Order\Ordering\Application\Services\OrderStatusNotifier;
use App\Domains\Order\Ordering\Application\UseCases\CancelOrderUseCase;
use App\Domains\Order\Ordering\Application\UseCases\CreateManualOrderUseCase;
use App\Domains\Order\Ordering\Application\UseCases\CreateOrderUseCase;
use App\Domains\Order\Ordering\Application\UseCases\GetOrdersUseCase;
use App\Domains\Order\Ordering\Application\UseCases\GetShippingOptionsUseCase;
use App\Domains\Order\Ordering\Application\UseCases\UpdateOrderStatusUseCase;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Models\SubOrderModel;
use App\Domains\Order\Ordering\Presentation\Http\Requests\CreateManualOrderRequest;
use App\Domains\Order\Ordering\Presentation\Http\Requests\CreateOrderRequest;
use App\Domains\Order\Ordering\Presentation\Http\Resources\OrderResource;
use App\Domains\Seller\Finance\Application\Services\AutoOrderIncomeService;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class OrderingController extends Controller
{
    public function __construct(
        private CreateOrderUseCase $createOrderUseCase,
        private CreateManualOrderUseCase $createManualOrderUseCase,
        private GetShippingOptionsUseCase $shippingOptionsUseCase,
        private CancelOrderUseCase $cancelOrderUseCase,
        private UpdateOrderStatusUseCase $updateOrderStatusUseCase,
        private GetOrdersUseCase $getOrdersUseCase,
        private OrderRepositoryInterface $orderRepository,
        private UserRepositoryInterface $userRepository,
        private StockMovementService $stockMovementService,
        private AutoOrderIncomeService $autoOrderIncome,
        private OrderStatusNotifier $statusNotifier
    ) {}

    public function shippingOptions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id' => ['required', 'integer', 'exists:addresses,id'],
            'cart_item_ids' => ['nullable', 'array', 'min:1', 'required_without:items', 'prohibits:items'],
            'cart_item_ids.*' => ['required', 'integer', 'distinct'],
            'items' => ['nullable', 'array', 'min:1', 'required_without:cart_item_ids', 'prohibits:cart_item_ids'],
            'items.*.product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        if (empty($validated['cart_item_ids']) && empty($validated['items'])) {
            return response()->json(['success' => false, 'message' => 'Pilih minimal satu produk untuk menghitung ongkir.'], 422);
        }

        $data = $this->shippingOptionsUseCase->execute(
            (string) $request->user()->id,
            (int) $validated['address_id'],
            $validated['cart_item_ids'] ?? [],
            $validated['items'] ?? null
        );

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(CreateOrderRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $order = $this->createOrderUseCase->execute(
                userId: (string) $request->user()->id,
                addressId: isset($data['address_id']) ? (int) $data['address_id'] : null,
                cartItemIds: $data['cart_item_ids'] ?? [],
                courier: (string) $data['courier'],
                service: $data['service'] ?? null,
                paymentMethod: (string) $data['payment_method'],
                voucherCode: $data['voucher_code'] ?? null,
                orderType: $data['order_type'] ?? 'normal',
                preorderReleaseAt: $data['preorder_release_at'] ?? null,
                scheduledAt: $data['scheduled_at'] ?? null,
                items: $data['items'] ?? []
            );

            return (new OrderResource($order))
                ->additional(['success' => true, 'message' => 'Pesanan berhasil dibuat.'])
                ->response()
                ->setStatusCode(201);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        }
    }

    public function storeManual(CreateManualOrderRequest $request): JsonResponse
    {
        if ($this->activeRole($request) !== 'seller') {
            throw new AccessDeniedHttpException('Hanya seller yang dapat membuat order manual.');
        }

        $data = $request->validated();

        try {
            $order = $this->createManualOrderUseCase->execute(
                itemInputs: $data['items'],
                customer: array_filter([
                    'name' => $data['customer_name'] ?? null,
                    'phone' => $data['customer_phone'] ?? null,
                    'email' => $data['customer_email'] ?? null,
                    'address' => $data['address'] ?? null,
                ]),
                courier: (string) $data['courier'],
                service: $data['service'] ?? null,
                shippingCost: (float) ($data['shipping_cost'] ?? 0),
                paymentMethod: (string) $data['payment_method'],
                paymentStatus: (string) ($data['payment_status'] ?? 'paid'),
                status: (string) ($data['status'] ?? 'pending'),
                orderType: (string) ($data['order_type'] ?? 'manual'),
                preorderReleaseAt: $data['preorder_release_at'] ?? null,
                scheduledAt: $data['scheduled_at'] ?? null,
                orderNumber: $data['order_number'] ?? null
            );

            return (new OrderResource($order))
                ->additional(['success' => true, 'message' => 'Order manual berhasil dibuat.'])
                ->response()
                ->setStatusCode(201);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 422);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $role = $this->activeRole($request);
        if ($role !== 'admin' && $role !== 'seller') {
            throw new AccessDeniedHttpException('Hanya seller yang dapat melihat seluruh pesanan.');
        }

        $orders = $this->getOrdersUseCase->execute(
            authenticatedUserId: (string) $request->user()->id,
            canViewAllOrders: true,
            filters: $request->only(['user_id', 'status', 'payment_status', 'order_type', 'date_from', 'date_to', 'search']),
            perPage: min(100, max(1, (int) $request->query('per_page', 15)))
        );

        return OrderResource::collection($orders)->additional(['success' => true])->response();
    }

    public function getByCustomer(Request $request, string $userId): JsonResponse
    {
        $authenticatedId = (string) $request->user()->id;
        $role = $this->activeRole($request);
        if ($role !== 'admin' && $userId !== $authenticatedId) {
            throw new AccessDeniedHttpException('Anda tidak dapat melihat pesanan pengguna lain.');
        }

        $orders = $this->getOrdersUseCase->execute(
            authenticatedUserId: $role === 'admin' ? $userId : $authenticatedId,
            canViewAllOrders: false,
            filters: $request->only(['status', 'payment_status', 'order_type', 'date_from', 'date_to', 'search']),
            perPage: min(100, max(1, (int) $request->query('per_page', 15)))
        );

        return OrderResource::collection($orders)->additional(['success' => true])->response();
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = $this->orderRepository->findById($id);
        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Order tidak ditemukan.'], 404);
        }

        $role = $this->activeRole($request);
        if ($role === 'buyer' && $order->userId !== (string) $request->user()->id) {
            throw new AccessDeniedHttpException('Anda tidak dapat melihat pesanan ini.');
        }

        return (new OrderResource($order))->additional(['success' => true])->response();
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = $this->orderRepository->findById($id);
        if (! $order || ($this->activeRole($request) !== 'admin' && $order->userId !== (string) $request->user()->id)) {
            throw new AccessDeniedHttpException('Anda tidak dapat membatalkan pesanan ini.');
        }

        $this->cancelOrderUseCase->execute($id);

        return response()->json(['success' => true, 'message' => 'Order berhasil dibatalkan.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $role = $this->activeRole($request);
        if ($role !== 'seller' && $role !== 'admin') {
            throw new AccessDeniedHttpException('Hanya seller atau admin yang dapat menghapus pesanan.');
        }

        $subOrder = SubOrderModel::query()->with('parentOrder')->find($id);
        if (! $subOrder) {
            return response()->json(['success' => false, 'message' => 'Pesanan tidak ditemukan.'], 404);
        }

        $parent = $subOrder->parentOrder;
        if ($role === 'seller' && $parent && ! $this->isManualOrder($parent)) {
            throw new AccessDeniedHttpException('Order marketplace tidak dapat dihapus oleh seller. Batalkan pesanan melalui status.');
        }
        if ($parent && in_array(strtolower((string) $parent->payment_status), ['paid', 'success'], true)) {
            throw new AccessDeniedHttpException('Pesanan yang sudah lunas tidak dapat dihapus.');
        }
        if (in_array($subOrder->status, ['processing', 'shipped', 'received', 'completed', 'cancelled'], true)) {
            throw new AccessDeniedHttpException("Pesanan berstatus {$subOrder->status} tidak dapat dihapus.");
        }

        DB::transaction(function () use ($subOrder): void {
            $this->stockMovementService->syncSubOrderStatus((int) $subOrder->id, (string) $subOrder->status, 'cancelled');
            $subOrder->items()->delete();
            $subOrder->delete();

            $parentId = (int) $subOrder->order_id;
            if (SubOrderModel::query()->where('order_id', $parentId)->count() === 0) {
                $order = OrderModel::query()->find($parentId);
                if ($order) {
                    DB::table('payments')->where('order_number', $order->order_number)->delete();
                    $order->delete();
                }
            }
        });

        return response()->json(['success' => true, 'message' => 'Pesanan berhasil dihapus.']);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,received,completed,cancelled'],
            'tracking_number' => ['nullable', 'string', 'max:255'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $role = $this->activeRole($request);

        if ($role === 'buyer') {
            if ($validated['status'] !== 'received') {
                throw new AccessDeniedHttpException('Buyer hanya dapat mengonfirmasi pesanan diterima.');
            }

            $order = $this->orderRepository->findById($id);

            if (! $order || $order->userId !== (string) $request->user()->id) {
                throw new AccessDeniedHttpException('Pesanan tidak ditemukan untuk akun Anda.');
            }

            $this->updateOrderStatusUseCase->execute($id, 'received');

            return response()->json(['success' => true, 'message' => 'Pesanan berhasil dikonfirmasi diterima.']);
        }

        if (! in_array($role, ['admin', 'seller'], true)) {
            throw new AccessDeniedHttpException('Hanya seller atau admin yang dapat memperbarui status.');
        }

        if ($role === 'seller') {
            $result = DB::transaction(function () use ($id, $validated): array {
                $subOrder = SubOrderModel::query()
                    ->where('id', $id)
                    ->lockForUpdate()
                    ->first();

                if (! $subOrder) {
                    throw new AccessDeniedHttpException('Sub-order tidak ditemukan.');
                }

                $previousStatus = (string) $subOrder->status;
                $nextStatus = (string) $validated['status'];
                $transitions = [
                    'pending' => ['processing', 'cancelled'],
                    'processing' => ['shipped', 'cancelled'],
                    'shipped' => ['received', 'completed'],
                    'received' => ['completed'],
                    'completed' => [],
                    'cancelled' => [],
                ];

                if ($previousStatus !== $nextStatus && ! in_array($nextStatus, $transitions[$previousStatus] ?? [], true)) {
                    throw new AccessDeniedHttpException("Perubahan status dari {$previousStatus} ke {$nextStatus} tidak diizinkan.");
                }

                if ($previousStatus === $nextStatus) {
                    return ['order_id' => (int) $subOrder->order_id, 'parent_completed' => false];
                }

                $parent = $subOrder->parentOrder()->lockForUpdate()->firstOrFail();

                if ($nextStatus === 'processing' && $parent->payment_method === 'midtrans' && $parent->payment_status !== 'paid') {
                    throw new AccessDeniedHttpException('Order Midtrans belum memiliki pembayaran yang berhasil.');
                }

                $subOrder->forceFill([
                    'status' => $nextStatus,
                    'tracking_number' => $validated['tracking_number'] ?? $subOrder->tracking_number,
                ])->save();

                $this->stockMovementService->syncSubOrderStatus((int) $subOrder->id, $previousStatus, $nextStatus);

                if ($nextStatus === 'completed') {
                    $this->autoOrderIncome->recordForSubOrder((int) $subOrder->id, (string) $parent->user_id);
                }

                $statuses = SubOrderModel::query()->where('order_id', $parent->id)->pluck('status');
                $parentStatus = 'pending';

                if ($statuses->every(fn (string $status): bool => $status === 'cancelled')) {
                    $parentStatus = 'cancelled';
                } elseif ($statuses->every(fn (string $status): bool => $status === 'completed')) {
                    $parentStatus = 'completed';
                } elseif ($statuses->every(fn (string $status): bool => in_array($status, ['received', 'completed'], true))) {
                    $parentStatus = 'received';
                } elseif ($statuses->every(fn (string $status): bool => in_array($status, ['shipped', 'received', 'completed'], true))) {
                    $parentStatus = 'shipped';
                } elseif ($statuses->contains(fn (string $status): bool => in_array($status, ['processing', 'shipped', 'received', 'completed'], true))) {
                    $parentStatus = 'processing';
                }

                $previousParentStatus = (string) $parent->status;
                $parent->forceFill([
                    'status' => $parentStatus,
                    'received_at' => $parentStatus === 'received' ? ($parent->received_at ?? now()) : $parent->received_at,
                ])->save();

                $this->stockMovementService->syncOrderStatus((int) $parent->id, $previousParentStatus, $parentStatus);

                return [
                    'order_id' => (int) $parent->id,
                    'user_id' => (string) $parent->user_id,
                    'order_type' => (string) ($parent->order_type ?? 'normal'),
                    'parent_completed' => $previousParentStatus !== 'completed' && $parentStatus === 'completed',
                    'parent_changed' => $previousParentStatus !== $parentStatus,
                    'parent_status' => $parentStatus,
                ];
            });

            if ($result['parent_changed'] && in_array($result['parent_status'], ['processing', 'completed'], true)) {
                $this->statusNotifier->notifyStatus($result['order_id'], $result['parent_status']);
            }

            return response()->json(['success' => true, 'message' => 'Status sub-order berhasil diperbarui.']);
        }

        $this->updateOrderStatusUseCase->execute($id, $validated['status'], $validated['reason'] ?? null);

        return response()->json(['success' => true, 'message' => 'Status order berhasil diperbarui.']);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'courier' => ['nullable', 'string', 'max:50'],
            'service' => ['nullable', 'string', 'max:100'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:pending,processing,shipped,received,completed,cancelled'],
            'tracking_number' => ['nullable', 'string', 'max:255'],
            'items' => ['nullable', 'array', 'min:1'],
            'items.*.order_item_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $role = $this->activeRole($request);

        if (! in_array($role, ['seller', 'admin'], true)) {
            throw new AccessDeniedHttpException('Hanya seller atau admin yang dapat mengubah detail pesanan.');
        }

        $subOrder = SubOrderModel::query()->with('parentOrder')->find($id);

        if (! $subOrder) {
            throw new AccessDeniedHttpException('Pesanan tidak ditemukan.');
        }

        $parent = $subOrder->parentOrder;

        if (! $parent) {
            return response()->json(['success' => false, 'message' => 'Pesanan tidak ditemukan.'], 404);
        }

        $editedItems = $validated['items'] ?? null;
        $isManual = $this->isManualOrder($parent);
        if ($editedItems !== null && ! $isManual) {
            throw new AccessDeniedHttpException('Produk hanya dapat diubah pada order manual.');
        }
        if ($editedItems !== null && ! in_array($subOrder->status, ['pending', 'processing'], true)) {
            throw new AccessDeniedHttpException('Produk hanya dapat diubah saat pesanan belum dikirim.');
        }

        $result = DB::transaction(function () use ($subOrder, $parent, $validated, $editedItems, $isManual): array {
            $previousStatus = (string) $subOrder->status;
            $nextStatus = (string) $validated['status'];
            $transitions = [
                'pending' => ['processing', 'cancelled'],
                'processing' => ['shipped', 'cancelled'],
                'shipped' => ['received', 'completed'],
                'received' => ['completed'],
                'completed' => [],
                'cancelled' => [],
            ];

            if ($previousStatus !== $nextStatus && ! in_array($nextStatus, $transitions[$previousStatus] ?? [], true)) {
                throw new AccessDeniedHttpException("Perubahan status dari {$previousStatus} ke {$nextStatus} tidak diizinkan.");
            }

            $itemsTotal = (float) $subOrder->total_items_price;

            if ($editedItems !== null) {
                $savedItems = $subOrder->items()->lockForUpdate()->get()->keyBy('id');

                if (count($editedItems) !== $savedItems->count()) {
                    throw new AccessDeniedHttpException('Jenis produk yang ada di pesanan tidak dapat ditambah atau dihapus.');
                }

                $itemsTotal = 0.0;
                $quantityMap = [];

                foreach ($editedItems as $itemInput) {
                    $saved = $savedItems->get($itemInput['order_item_id']);

                    if (! $saved) {
                        throw new AccessDeniedHttpException('Item produk tidak ditemukan pada pesanan.');
                    }

                    $unitPrice = (float) $itemInput['unit_price'];
                    $quantity = (int) $itemInput['quantity'];
                    $itemsTotal += $unitPrice * $quantity;
                    $quantityMap[] = [
                        'order_item_id' => (int) $saved->id,
                        'quantity' => $quantity,
                    ];
                }

                $this->stockMovementService->reconcileSubOrderItems((int) $subOrder->id, $quantityMap);

                foreach ($editedItems as $itemInput) {
                    $saved = $savedItems->get($itemInput['order_item_id']);
                    $saved->forceFill([
                        'price' => (float) $itemInput['unit_price'],
                        'quantity' => (int) $itemInput['quantity'],
                    ])->save();
                }

                $subOrder->forceFill(['total_items_price' => $itemsTotal])->save();
            }

            $courier = strtolower(trim((string) ($validated['courier'] ?? ''))) ?: (string) $subOrder->courier;
            $service = ($validated['service'] ?? null) !== null ? strtoupper(trim((string) $validated['service'])) : $subOrder->service;

            if (! $isManual && in_array($courier, ['ambil_sendiri', 'pickup'], true)) {
                throw new AccessDeniedHttpException('Order marketplace tidak dapat diubah ke metode ambil sendiri.');
            }

            $subOrder->forceFill([
                'courier' => $courier,
                'service' => $service,
                'shipping_cost' => $isManual
                    ? (($validated['shipping_cost'] ?? null) !== null ? (float) $validated['shipping_cost'] : $subOrder->shipping_cost)
                    : $subOrder->shipping_cost,
                'tracking_number' => $validated['tracking_number'] ?? $subOrder->tracking_number,
                'status' => $nextStatus,
            ])->save();

            if ($previousStatus !== $nextStatus) {
                $this->stockMovementService->syncSubOrderStatus((int) $subOrder->id, $previousStatus, $nextStatus);
            }

            if ($nextStatus === 'completed') {
                $this->autoOrderIncome->recordForSubOrder((int) $subOrder->id, (string) $parent->user_id);
            }

            if ($isManual) {
                $name = trim((string) $validated['customer_name']);
                $phone = trim((string) ($validated['customer_phone'] ?? ''));
                $address = trim((string) ($validated['address'] ?? ''));
                $shippingAddress = in_array($courier, ['ambil_sendiri', 'pickup'], true)
                    ? 'Ambil sendiri di toko'
                    : json_encode([
                        'recipient' => $name,
                        'phone' => $phone,
                        'address' => $address,
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

                $hasDiscount = (float) $parent->discount_amount > 0 || (float) $parent->shipping_discount_amount > 0;
                $parent->forceFill([
                    'shipping_address' => $shippingAddress,
                    'total_amount' => $hasDiscount
                        ? $parent->total_amount
                        : $itemsTotal + (float) $subOrder->shipping_cost,
                ])->save();
            }

            if ($previousStatus === $nextStatus) {
                return [
                    'parent_changed' => false,
                    'parent_completed' => false,
                    'notify' => false,
                ];
            }

            $statuses = SubOrderModel::query()->where('order_id', $parent->id)->pluck('status');
            $parentStatus = 'pending';

            if ($statuses->every(fn (string $status): bool => $status === 'cancelled')) {
                $parentStatus = 'cancelled';
            } elseif ($statuses->every(fn (string $status): bool => $status === 'completed')) {
                $parentStatus = 'completed';
            } elseif ($statuses->every(fn (string $status): bool => in_array($status, ['received', 'completed'], true))) {
                $parentStatus = 'received';
            } elseif ($statuses->every(fn (string $status): bool => in_array($status, ['shipped', 'received', 'completed'], true))) {
                $parentStatus = 'shipped';
            } elseif ($statuses->contains(fn (string $status): bool => in_array($status, ['processing', 'shipped', 'received', 'completed'], true))) {
                $parentStatus = 'processing';
            }

            $previousParentStatus = (string) $parent->status;
            $parent->forceFill([
                'status' => $parentStatus,
                'received_at' => $parentStatus === 'received' ? ($parent->received_at ?? now()) : $parent->received_at,
            ])->save();

            $this->stockMovementService->syncOrderStatus((int) $parent->id, $previousParentStatus, $parentStatus);

            return [
                'parent_changed' => $previousParentStatus !== $parentStatus,
                'parent_completed' => $previousParentStatus !== 'completed' && $parentStatus === 'completed',
                'notify' => true,
                'order_id' => (int) $parent->id,
                'user_id' => (string) $parent->user_id,
                'order_type' => (string) ($parent->order_type ?? 'normal'),
                'parent_status' => $parentStatus,
            ];
        });

        if ($result['notify']) {
            $this->statusNotifier->notifyStatus($result['order_id'], $result['parent_status'] ?? $nextStatus ?? $validated['status']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail pesanan berhasil diperbarui.',
            'data' => [
                'id' => (int) $subOrder->id,
                'status' => (string) $subOrder->status,
                'tracking_number' => (string) ($subOrder->tracking_number ?? ''),
            ],
        ]);
    }

    /**
     * Kirim notifikasi (chat + email) ke buyer untuk status order saat ini,
     * atau status yang ditentukan. Endpoint ini dipakai engine.js saat order
     * disetujui/diproses atau selesai; dipanggil ulang tidak mengirim chat
     * ganda (idempotent per status).
     */
    public function notifyStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:pending,processing,shipped,received,completed,cancelled'],
        ]);

        $order = $this->orderRepository->findById($id);
        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Order tidak ditemukan.'], 404);
        }

        $role = $this->activeRole($request);

        if ($role === 'buyer' && $order->userId !== (string) $request->user()->id) {
            throw new AccessDeniedHttpException('Anda tidak dapat mengirim notifikasi order ini.');
        }

        $status = strtolower(trim((string) ($validated['status'] ?? $order->status)));

        $result = $this->statusNotifier->notifyStatus($id, $status);

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi status order berhasil dikirim.',
            'data' => [
                'order_id' => $id,
                'status' => $status,
                'notified_chat' => $result['chat'],
                'notified_email' => $result['email'],
            ],
        ]);
    }

    private function isManualOrder(?object $order): bool
    {
        if (! $order) {
            return false;
        }

        return (string) ($order->order_type ?? 'normal') === 'manual'
            || str_starts_with((string) ($order->order_number ?? ''), 'MAN-');
    }

    private function activeRole(Request $request): string
    {
        return (string) ($this->userRepository->getActiveRoleFromCurrentToken($request->user()) ?: 'buyer');
    }
}
