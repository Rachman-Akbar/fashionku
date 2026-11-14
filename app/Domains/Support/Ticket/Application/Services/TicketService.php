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
        private AdminNotificationService $notificationService,
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

    public function context(string $userId, ?string $activeRole = null): array
    {
        $role = strtolower(trim((string) ($activeRole ?: 'buyer')));
        $user = DB::table('users')
            ->where('id', $userId)
            ->whereNull('deleted_at')
            ->first(['id', 'name', 'email']);

        if (! $user) {
            throw new InvalidArgumentException('User aktif tidak ditemukan.');
        }

        $rows = DB::table('orders')
            ->when(
                ! in_array($role, ['admin', 'seller'], true),
                fn ($query) => $query->where('orders.user_id', $userId)
            )
            ->select([
                'orders.id',
                'orders.order_number',
                'orders.status',
                'orders.created_at',
            ])
            ->orderByDesc('orders.created_at')
            ->limit(200)
            ->get();

        $orders = $rows->map(fn ($row): array => [
            'id' => (int) $row->id,
            'order_number' => (string) $row->order_number,
            'status' => (string) $row->status,
            'created_at' => $row->created_at,
        ])->values();

        return [
            'role' => $role,
            'user' => ['id' => (string) $user->id, 'name' => $user->name, 'email' => $user->email],
            'orders' => $orders->all(),
        ];
    }

    public function create(array $data, string $userId, ?string $activeRole = null): SupportTicketModel
    {
        return DB::transaction(function () use ($data, $userId, $activeRole): SupportTicketModel {
            $role = strtolower(trim((string) ($activeRole ?: 'buyer')));
            $ticketUserId = $role === 'admin' && ! empty($data['user_id']) ? (string) $data['user_id'] : $userId;
            $orderId = isset($data['order_id']) && $data['order_id'] !== null ? (int) $data['order_id'] : null;

            if ($orderId !== null) {
                $orderQuery = DB::table('orders')->where('orders.id', $orderId);

                if ($role !== 'admin' && $role !== 'seller') {
                    $orderQuery->where('orders.user_id', $ticketUserId);
                }

                if (! $orderQuery->exists()) {
                    throw new InvalidArgumentException('Order tidak ditemukan atau tidak dapat diakses.');
                }
            }

            $model = new SupportTicketModel([
                'ticket_number' => 'HLP-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5)),
                'user_id' => $ticketUserId,
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
                ], $userId);
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
                ], $userId);
            }

            return $saved;
        });
    }

    public function delete(int $id): void
    {
        $this->repository->delete($this->find($id, null));
    }
}
