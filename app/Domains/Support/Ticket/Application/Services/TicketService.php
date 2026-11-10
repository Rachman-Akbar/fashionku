<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Application\Services;

use App\Domains\Admin\Notification\Application\Services\AdminNotificationService;
use App\Domains\Support\Ticket\Domain\Repositories\TicketRepositoryInterface;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketMessageModel;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class TicketService
{
    public function __construct(
        private TicketRepositoryInterface $repository,
        private AdminNotificationService $notificationService
    ) {}

    public function paginate(array $filters, int $perPage, ?string $ownerId): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage, $ownerId);
    }

    public function find(int $id, ?string $ownerId): SupportTicketModel
    {
        return $this->repository->find($id, $ownerId)
            ?? throw new InvalidArgumentException('Help tidak ditemukan.');
    }

    public function context(string $userId, ?string $activeRole = null, ?int $sellerStoreId = null): array
    {
        $role = strtolower(trim((string) ($activeRole ?: 'buyer')));
        $user = DB::table('users')
            ->where('id', $userId)
            ->whereNull('deleted_at')
            ->first(['id', 'name', 'email']);

        if (! $user) {
            throw new InvalidArgumentException('User aktif tidak ditemukan.');
        }

        if ($role === 'admin') {
            return [
                'role' => $role,
                'user' => ['id' => (string) $user->id, 'name' => $user->name, 'email' => $user->email],
                'store' => null,
                'stores' => [],
                'orders' => [],
            ];
        }

        if ($role === 'seller' && ! $sellerStoreId) {
            return [
                'role' => $role,
                'user' => ['id' => (string) $user->id, 'name' => $user->name, 'email' => $user->email],
                'store' => null,
                'stores' => [],
                'orders' => [],
            ];
        }

        $rows = DB::table('orders')
            ->join('sub_orders', 'sub_orders.order_id', '=', 'orders.id')
            ->join('stores', 'stores.id', '=', 'sub_orders.store_id')
            ->when(
                $role === 'seller',
                fn ($query) => $query->where('sub_orders.store_id', $sellerStoreId),
                fn ($query) => $query->where('orders.user_id', $userId)
            )
            ->whereNull('stores.deleted_at')
            ->select([
                'orders.id',
                'orders.order_number',
                'orders.status',
                'orders.created_at',
                'stores.id as store_id',
                'stores.name as store_name',
            ])
            ->orderByDesc('orders.created_at')
            ->limit(200)
            ->get();

        $stores = $rows
            ->map(fn ($row): array => ['id' => (int) $row->store_id, 'name' => (string) $row->store_name])
            ->unique('id')
            ->values();

        $sellerStore = null;
        if ($role === 'seller' && $sellerStoreId) {
            $store = DB::table('stores')
                ->where('id', $sellerStoreId)
                ->where('user_id', $userId)
                ->whereNull('deleted_at')
                ->first(['id', 'name']);

            if ($store) {
                $sellerStore = ['id' => (int) $store->id, 'name' => (string) $store->name];
                $stores = collect([$sellerStore]);
            }
        }

        $orders = $rows
            ->groupBy('id')
            ->map(function ($orderRows): array {
                $first = $orderRows->first();
                $orderStores = $orderRows
                    ->map(fn ($row): array => ['id' => (int) $row->store_id, 'name' => (string) $row->store_name])
                    ->unique('id')
                    ->values()
                    ->all();

                return [
                    'id' => (int) $first->id,
                    'order_number' => (string) $first->order_number,
                    'status' => (string) $first->status,
                    'created_at' => $first->created_at,
                    'stores' => $orderStores,
                ];
            })
            ->values();

        return [
            'role' => $role,
            'user' => ['id' => (string) $user->id, 'name' => $user->name, 'email' => $user->email],
            'store' => $sellerStore,
            'stores' => $stores->all(),
            'orders' => $orders->all(),
        ];
    }

    public function create(array $data, string $userId, ?string $activeRole = null, ?int $sellerStoreId = null): SupportTicketModel
    {
        return DB::transaction(function () use ($data, $userId, $activeRole, $sellerStoreId): SupportTicketModel {
            $role = strtolower(trim((string) ($activeRole ?: 'buyer')));
            $ticketUserId = $role === 'admin' && ! empty($data['user_id']) ? (string) $data['user_id'] : $userId;
            $orderId = isset($data['order_id']) && $data['order_id'] !== null ? (int) $data['order_id'] : null;
            $requestedStoreId = isset($data['store_id']) && $data['store_id'] !== null ? (int) $data['store_id'] : null;
            $storeId = $role === 'seller' ? $sellerStoreId : $requestedStoreId;

            if ($role === 'seller' && ! $storeId) {
                throw new InvalidArgumentException('Toko seller tidak ditemukan pada sesi aktif.');
            }

            if ($orderId !== null) {
                $orderQuery = DB::table('orders')->where('orders.id', $orderId);

                if ($role === 'seller') {
                    $orderQuery->whereExists(function ($query) use ($sellerStoreId): void {
                        $query->selectRaw('1')
                            ->from('sub_orders')
                            ->whereColumn('sub_orders.order_id', 'orders.id')
                            ->where('sub_orders.store_id', $sellerStoreId);
                    });
                } elseif ($role !== 'admin' || ! empty($data['user_id'])) {
                    $orderQuery->where('orders.user_id', $ticketUserId);
                }

                if (! $orderQuery->exists()) {
                    throw new InvalidArgumentException('Order tidak ditemukan atau tidak dapat diakses.');
                }

                $orderStoreIds = DB::table('sub_orders')
                    ->where('order_id', $orderId)
                    ->pluck('store_id')
                    ->map(fn ($id): int => (int) $id)
                    ->unique()
                    ->values();

                if ($storeId === null && $orderStoreIds->count() === 1) {
                    $storeId = (int) $orderStoreIds->first();
                }

                if ($role === 'seller') {
                    $storeId = $sellerStoreId;
                }

                if ($storeId !== null && ! $orderStoreIds->contains((int) $storeId)) {
                    throw new InvalidArgumentException('Toko pada Help tidak terhubung dengan pesanan yang dipilih.');
                }
            }

            if ($storeId !== null) {
                $storeQuery = DB::table('stores')->where('id', $storeId)->whereNull('deleted_at');

                if ($role === 'seller') {
                    $storeQuery->where('user_id', $userId);
                }

                if (! $storeQuery->exists()) {
                    throw new InvalidArgumentException('Toko pada Help tidak ditemukan atau tidak dapat diakses.');
                }

                if ($role !== 'admin' && $role !== 'seller') {
                    $hasStoreHistory = DB::table('orders')
                        ->join('sub_orders', 'sub_orders.order_id', '=', 'orders.id')
                        ->where('orders.user_id', $ticketUserId)
                        ->where('sub_orders.store_id', $storeId)
                        ->exists();

                    if (! $hasStoreHistory) {
                        throw new InvalidArgumentException('Toko pada Help tidak berasal dari riwayat pesanan akun Anda.');
                    }
                }
            }

            $model = new SupportTicketModel([
                'ticket_number' => 'HLP-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5)),
                'user_id' => $ticketUserId,
                'store_id' => $storeId,
                'order_id' => $orderId,
                'category' => $data['category'],
                'subject' => trim((string) $data['subject']),
                'description' => trim((string) $data['description']),
                'priority' => $data['priority'] ?? 'normal',
                'status' => 'open',
                'last_replied_at' => now(),
                'is_active' => true,
            ]);

            $saved = $this->repository->save($model);
            SupportTicketMessageModel::create([
                'ticket_id' => $saved->id,
                'user_id' => $userId,
                'message' => $saved->description,
                'attachments' => $data['attachments'] ?? null,
                'is_internal' => false,
            ]);

            $result = $this->repository->find($saved->id, null) ?? $saved;

            if ($role !== 'admin') {
                $this->notificationService->notifyAdmins([
                    'module' => 'support',
                    'type' => 'support.ticket.created',
                    'title' => 'Help baru',
                    'message' => $result->ticket_number.' · '.$result->subject,
                    'reference_type' => 'support_ticket',
                    'reference_id' => $result->id,
                    'url' => '/admin/help?ticket='.$result->id,
                    'meta' => ['priority' => $result->priority, 'category' => $result->category],
                ], $userId, $storeId);
            }

            return $result;
        });
    }

    public function updateStatus(int $id, array $data, string $actorId): SupportTicketModel
    {
        $model = $this->find($id, null);
        $status = $data['status'];
        $model->status = $status;
        $model->assigned_to = $data['assigned_to'] ?? $model->assigned_to ?? $actorId;
        $model->resolved_at = in_array($status, ['resolved', 'closed'], true) ? now() : null;

        return $this->repository->save($model);
    }

    public function reply(int $id, array $data, string $userId, bool $isAdmin): SupportTicketModel
    {
        return DB::transaction(function () use ($id, $data, $userId, $isAdmin): SupportTicketModel {
            $model = $this->find($id, $isAdmin ? null : $userId);
            SupportTicketMessageModel::create([
                'ticket_id' => $model->id,
                'user_id' => $userId,
                'message' => trim((string) $data['message']),
                'attachments' => $data['attachments'] ?? null,
                'is_internal' => $isAdmin && (bool) ($data['is_internal'] ?? false),
            ]);
            $model->last_replied_at = now();

            if ($isAdmin && $model->status === 'open') {
                $model->status = 'in_progress';
                $model->assigned_to = $userId;
            }

            $saved = $this->repository->save($model);

            if (! $isAdmin) {
                $this->notificationService->notifyAdmins([
                    'module' => 'support',
                    'type' => 'support.ticket.replied',
                    'title' => 'Balasan Help baru',
                    'message' => $saved->ticket_number.' · '.$saved->subject,
                    'reference_type' => 'support_ticket',
                    'reference_id' => $saved->id,
                    'url' => '/admin/help?ticket='.$saved->id,
                    'meta' => ['status' => $saved->status, 'priority' => $saved->priority],
                ], $userId, $saved->store_id ? (int) $saved->store_id : null);
            }

            return $saved;
        });
    }

    public function delete(int $id): void
    {
        $this->repository->delete($this->find($id, null));
    }
}
