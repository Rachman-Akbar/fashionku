<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Application\Services;

use App\Domains\Admin\Notification\Application\Services\AdminNotificationService;
use App\Domains\Admin\Notification\Domain\Repositories\AdminNotificationRepositoryInterface;
use App\Domains\Communication\Chat\Domain\Repositories\ConversationRepositoryInterface;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ChatMessageModel;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use App\Domains\Communication\Chat\Presentation\Events\MessageSent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

final class ConversationService
{
    public function __construct(private ConversationRepositoryInterface $repository) {}

    public function paginate(string $userId, array $filters, int $perPage, bool $admin): LengthAwarePaginator
    {
        return $this->repository->paginateForUser($userId, $filters, $perPage, $admin);
    }

    public function find(int $id, string $userId, bool $admin): ConversationModel
    {
        return $this->repository->findForUser($id, $userId, $admin)
            ?? throw new InvalidArgumentException('Percakapan tidak ditemukan.');
    }

    public function start(array $data, string $userId, bool $admin): ConversationModel
    {
        return DB::transaction(function () use ($data, $userId, $admin): ConversationModel {
            $type = strtolower(trim((string) ($data['type'] ?? 'direct')));
            $requestedParticipantIds = collect($data['participant_ids'] ?? [])
                ->map(fn ($id) => (string) $id)
                ->filter()
                ->unique()
                ->values();
            $participantIds = $admin ? $requestedParticipantIds : collect();
            $storeId = isset($data['store_id']) && $data['store_id'] !== null ? (int) $data['store_id'] : null;
            $orderId = isset($data['order_id']) && $data['order_id'] !== null ? (int) $data['order_id'] : null;

            if (! $admin && ! $storeId && ! $orderId) {
                throw new InvalidArgumentException('Percakapan buyer dan seller harus terhubung dengan toko atau order.');
            }

            if ($orderId) {
                $type = 'order';
                [$storeId, $orderParticipants] = $this->resolveOrderParticipants($orderId, $storeId, $userId, $admin);
                $participantIds = $participantIds->merge($orderParticipants);
            } elseif ($storeId) {
                $type = 'store';
                $storeOwnerId = $this->activeStoreOwner($storeId);

                if ($admin) {
                    $participantIds->push($storeOwnerId);
                } elseif ($storeOwnerId === $userId) {
                    $buyerIds = $requestedParticipantIds
                        ->reject(fn (string $id): bool => $id === $userId)
                        ->values();

                    if ($buyerIds->count() !== 1) {
                        throw new InvalidArgumentException('Seller harus memilih satu buyer tujuan.');
                    }

                    $buyerId = (string) $buyerIds->first();
                    $this->assertStoreCustomer($storeId, $buyerId);
                    $participantIds = collect([$storeOwnerId, $buyerId]);
                } else {
                    $participantIds = collect([$userId, $storeOwnerId]);
                }
            }

            $participantIds->push($userId);
            $participantIds = $participantIds->map(fn ($id) => (string) $id)->filter()->unique()->values();

            if (! $admin && $participantIds->count() < 2) {
                throw new InvalidArgumentException('Percakapan membutuhkan seller atau buyer tujuan.');
            }

            $this->assertParticipantsActive($participantIds);

            $existing = $type === 'announcement'
                ? null
                : $this->findMatchingConversation($type, $storeId, $orderId, $participantIds);

            if ($existing) {
                return $this->repository->findForUser($existing->id, $userId, $admin) ?? $existing;
            }

            $model = $this->repository->save(new ConversationModel([
                'type' => $type,
                'store_id' => $storeId,
                'order_id' => $orderId,
                'subject' => $data['subject'] ?? null,
                'target_role' => $data['target_role'] ?? null,
                'is_active' => true,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]));

            $rows = $participantIds->mapWithKeys(fn (string $id) => [$id => ['joined_at' => now()]])->all();
            $model->participants()->syncWithoutDetaching($rows);

            return $this->repository->findForUser($model->id, $userId, $admin) ?? $model;
        });
    }

    public function startModeration(array $data, string $adminId): ConversationModel
    {
        return DB::transaction(function () use ($data, $adminId): ConversationModel {
            $type = strtolower(trim((string) ($data['type'] ?? 'direct')));
            $storeId = isset($data['store_id']) && $data['store_id'] !== null ? (int) $data['store_id'] : null;
            $participantIds = collect($data['participant_ids'] ?? [])
                ->map(fn ($id) => (string) $id)
                ->filter()
                ->unique()
                ->values();

            if ($type === 'store') {
                if (! $storeId) {
                    throw new InvalidArgumentException('Moderasi toko memerlukan store_id.');
                }

                $ownerId = (string) DB::table('stores')
                    ->where('id', $storeId)
                    ->whereNull('deleted_at')
                    ->value('user_id');

                if ($ownerId === '') {
                    throw new InvalidArgumentException('Toko untuk percakapan moderasi tidak ditemukan.');
                }

                $participantIds->push($ownerId);
            }

            $participantIds->push($adminId);
            $participantIds = $participantIds->map(fn ($id) => (string) $id)->filter()->unique()->values();

            $existing = $this->findMatchingConversation($type, $storeId, null, $participantIds);

            if ($existing) {
                return $this->repository->findForUser($existing->id, $adminId, true) ?? $existing;
            }

            $model = $this->repository->save(new ConversationModel([
                'type' => $type,
                'store_id' => $storeId,
                'order_id' => null,
                'subject' => $data['subject'] ?? null,
                'target_role' => $data['target_role'] ?? null,
                'is_active' => true,
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]));

            $rows = $participantIds->mapWithKeys(fn (string $id) => [$id => ['joined_at' => now()]])->all();
            $model->participants()->syncWithoutDetaching($rows);

            return $this->repository->findForUser($model->id, $adminId, true) ?? $model;
        });
    }

    public function announce(array $data, string $adminId): ConversationModel
    {
        return DB::transaction(function () use ($data, $adminId): ConversationModel {
            $targetRole = $data['target_role'] ?? null;
            $userIds = collect($data['user_ids'] ?? [])->map(fn ($id) => (string) $id)->filter()->unique();

            if ($targetRole) {
                $roleUsers = DB::table('user_roles')
                    ->join('roles', 'roles.id', '=', 'user_roles.role_id')
                    ->join('users', 'users.id', '=', 'user_roles.user_id')
                    ->where('roles.name', $targetRole)
                    ->where('users.is_active', true)
                    ->whereNull('users.deleted_at')
                    ->pluck('users.id');
                $userIds = $userIds->merge($roleUsers->map(fn ($id) => (string) $id));
            }

            if ($userIds->isEmpty()) {
                throw new InvalidArgumentException('Announcement harus memiliki target role atau user tujuan.');
            }

            $userIds->push($adminId);
            $conversation = $this->start([
                'type' => 'announcement',
                'subject' => $data['subject'],
                'target_role' => $targetRole,
                'participant_ids' => $userIds->unique()->values()->all(),
            ], $adminId, true);

            $this->send($conversation->id, [
                'message_type' => 'announcement',
                'message' => $data['message'],
                'attachments' => $data['attachments'] ?? null,
            ], $adminId, true);

            return $this->repository->findForUser($conversation->id, $adminId, true) ?? $conversation;
        });
    }

    public function send(int $conversationId, array $data, string $userId, bool $admin): ChatMessageModel
    {
        $conversation = $this->find($conversationId, $userId, $admin);

        if (! $conversation->is_active) {
            throw new InvalidArgumentException('Percakapan sudah tidak aktif.');
        }

        if ($conversation->type === 'announcement' && ! $admin) {
            throw new InvalidArgumentException('Announcement hanya dapat dikirim oleh admin.');
        }

        $cleanMessage = trim((string) ($data['message'] ?? ''));
        if ($cleanMessage === '') {
            throw new InvalidArgumentException('Pesan tidak boleh kosong.');
        }

        $message = ChatMessageModel::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'message_type' => $data['message_type'] ?? 'text',
            'message' => $cleanMessage,
            'attachments' => $data['attachments'] ?? null,
        ])->load(['sender:id,name,avatar', 'conversation.store:id,user_id,name,logo', 'conversation.participants:id']);

        DB::table('conversations')->where('id', $conversation->id)->update(['updated_at' => now()]);
        $this->markRead($conversation->id, $userId, $admin);

        $broadcast = fn (): mixed => event(new MessageSent($message));
        if (DB::transactionLevel() > 0) {
            DB::afterCommit($broadcast);
        } else {
            $broadcast();
        }

        if (! $admin) {
            $adminParticipantIds = DB::table('conversation_participants')
                ->join('user_roles', 'user_roles.user_id', '=', 'conversation_participants.user_id')
                ->join('roles', 'roles.id', '=', 'user_roles.role_id')
                ->where('conversation_participants.conversation_id', $conversation->id)
                ->whereNull('conversation_participants.left_at')
                ->whereIn('roles.name', ['admin', 'super_admin'])
                ->where('roles.is_active', true)
                ->where('conversation_participants.user_id', '!=', $userId)
                ->distinct()
                ->pluck('conversation_participants.user_id');

            if ($adminParticipantIds->isNotEmpty()) {
                $this->notifyAdminParticipants(
                    $adminParticipantIds,
                    $conversation,
                    $userId,
                    $cleanMessage
                );
            }
        }

        return $message;
    }

    public function markRead(int $conversationId, string $userId, bool $admin): void
    {
        $conversation = $this->find($conversationId, $userId, $admin);
        DB::table('conversation_participants')
            ->where('conversation_id', $conversation->id)
            ->where('user_id', $userId)
            ->update(['last_read_at' => now()]);

        $messageIds = DB::table('chat_messages')
            ->leftJoin('chat_message_reads', function ($join) use ($userId): void {
                $join->on('chat_message_reads.message_id', '=', 'chat_messages.id')
                    ->where('chat_message_reads.user_id', '=', $userId);
            })
            ->where('chat_messages.conversation_id', $conversation->id)
            ->where('chat_messages.sender_id', '!=', $userId)
            ->whereNull('chat_messages.deleted_at')
            ->whereNull('chat_message_reads.message_id')
            ->pluck('chat_messages.id');

        $messageIds->chunk(500)->each(function (Collection $chunk) use ($userId): void {
            $readAt = now();
            DB::table('chat_message_reads')->insertOrIgnore(
                $chunk->map(fn ($messageId): array => [
                    'message_id' => $messageId,
                    'user_id' => $userId,
                    'read_at' => $readAt,
                ])->all()
            );
        });
    }

    private function resolveOrderParticipants(int $orderId, ?int $storeId, string $userId, bool $admin): array
    {
        $order = DB::table('orders')->where('id', $orderId)->first(['user_id']);
        if (! $order) {
            throw new InvalidArgumentException('Order untuk percakapan tidak ditemukan.');
        }

        $stores = DB::table('sub_orders')
            ->join('stores', 'stores.id', '=', 'sub_orders.store_id')
            ->where('sub_orders.order_id', $orderId)
            ->where('stores.is_active', true)
            ->whereNull('stores.deleted_at')
            ->get(['stores.id as store_id', 'stores.user_id']);

        if ($stores->isEmpty()) {
            throw new InvalidArgumentException('Order tidak memiliki toko aktif untuk percakapan.');
        }

        $ownerIds = $stores->pluck('user_id')->map(fn ($id) => (string) $id)->unique();
        $buyerId = (string) $order->user_id;
        if (! $admin && $buyerId !== $userId && ! $ownerIds->contains($userId)) {
            throw new InvalidArgumentException('Anda tidak terlibat dalam order tersebut.');
        }

        if (! $storeId) {
            $ownedStore = $stores->first(fn ($row) => (string) $row->user_id === $userId);
            if ($ownedStore) {
                $storeId = (int) $ownedStore->store_id;
            } elseif ($buyerId === $userId && $stores->count() === 1) {
                $storeId = (int) $stores->first()->store_id;
            } elseif (! $admin) {
                throw new InvalidArgumentException('Pilih toko tujuan untuk chat order yang memiliki lebih dari satu seller.');
            }
        }

        if ($storeId) {
            $store = $stores->first(fn ($row) => (int) $row->store_id === $storeId);
            if (! $store) {
                throw new InvalidArgumentException('Toko tidak terhubung dengan order tersebut.');
            }

            return [$storeId, collect([$buyerId, (string) $store->user_id])];
        }

        return [null, collect([$buyerId])->merge($ownerIds)];
    }

    private function activeStoreOwner(int $storeId): string
    {
        $store = DB::table('stores')
            ->where('id', $storeId)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->first(['user_id']);

        if (! $store) {
            throw new InvalidArgumentException('Toko untuk percakapan tidak ditemukan atau tidak aktif.');
        }

        return (string) $store->user_id;
    }

    private function assertStoreCustomer(int $storeId, string $buyerId): void
    {
        $isCustomer = DB::table('orders')
            ->join('sub_orders', 'sub_orders.order_id', '=', 'orders.id')
            ->where('sub_orders.store_id', $storeId)
            ->where('orders.user_id', $buyerId)
            ->whereNotIn('orders.status', ['cancelled'])
            ->exists();

        if (! $isCustomer) {
            throw new InvalidArgumentException('Buyer belum pernah melakukan transaksi pada toko ini.');
        }
    }

    private function assertParticipantsActive(Collection $participantIds): void
    {
        $activeParticipantCount = DB::table('users')
            ->whereIn('id', $participantIds->all())
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->count();

        if ($activeParticipantCount !== $participantIds->count()) {
            throw new InvalidArgumentException('Salah satu peserta percakapan tidak tersedia atau tidak aktif.');
        }
    }

    private function findMatchingConversation(string $type, ?int $storeId, ?int $orderId, Collection $participantIds): ?ConversationModel
    {
        $ids = $participantIds->values()->all();

        return ConversationModel::query()
            ->where('type', $type)
            ->when($orderId, fn (Builder $query) => $query->where('order_id', $orderId), fn (Builder $query) => $query->whereNull('order_id'))
            ->when($storeId, fn (Builder $query) => $query->where('store_id', $storeId), fn (Builder $query) => $query->whereNull('store_id'))
            ->whereHas('participants', fn (Builder $query) => $query->whereIn('users.id', $ids)->whereNull('conversation_participants.left_at'), '=', count($ids))
            ->whereDoesntHave('participants', fn (Builder $query) => $query->whereNotIn('users.id', $ids)->whereNull('conversation_participants.left_at'))
            ->first();
    }

    private function notifyAdminParticipants(Collection $adminParticipantIds, ConversationModel $conversation, string $userId, string $cleanMessage): void
    {
        try {
            if (! app()->bound(AdminNotificationRepositoryInterface::class)) {
                return;
            }

            app(AdminNotificationService::class)->notifyAdminUsers($adminParticipantIds, [
                'module' => 'chat',
                'type' => 'chat.message.received',
                'title' => 'Pesan chat baru',
                'message' => mb_strimwidth($cleanMessage, 0, 120, '...'),
                'reference_type' => 'conversation',
                'reference_id' => $conversation->id,
                'url' => '/admin/chat?conversation='.$conversation->id,
                'meta' => ['conversation_type' => $conversation->type],
            ], $userId, $conversation->store_id ? (int) $conversation->store_id : null);
        } catch (Throwable $exception) {
            Log::warning('Admin chat notification skipped.', [
                'conversation_id' => $conversation->id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
