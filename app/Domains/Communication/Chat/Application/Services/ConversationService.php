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
            $orderId = isset($data['order_id']) && $data['order_id'] !== null ? (int) $data['order_id'] : null;

            if ($orderId) {
                $type = 'order';
                $participantIds = $participantIds->merge($this->orderParticipants($orderId, $userId, $admin));
            } elseif (! $admin) {
                $type = 'store';
                $otherParticipantIds = $requestedParticipantIds->reject(fn (string $id): bool => $id === $userId)->values();

                if ($otherParticipantIds->isEmpty()) {
                    // Buyer membuka percakapan dengan operator toko tunggal.
                    $participantIds = $participantIds->merge($this->storeOperatorIds());
                } elseif ($otherParticipantIds->count() === 1) {
                    // Seller memilih satu buyer tujuan.
                    $buyerId = (string) $otherParticipantIds->first();
                    $this->assertCustomer($buyerId);
                    $participantIds = collect([$userId, $buyerId]);
                } else {
                    throw new InvalidArgumentException('Seller harus memilih satu buyer tujuan.');
                }
            } elseif ($type === 'store') {
                $participantIds = $participantIds->merge($this->storeOperatorIds());
            }

            $participantIds->push($userId);
            $participantIds = $participantIds->map(fn ($id) => (string) $id)->filter()->unique()->values();

            if ($participantIds->count() < 2) {
                throw new InvalidArgumentException('Percakapan membutuhkan admin toko atau buyer tujuan.');
            }

            $this->assertParticipantsActive($participantIds);

            $existing = $type === 'announcement'
                ? null
                : $this->findMatchingConversation($type, $orderId, $participantIds);

            if ($existing) {
                return $this->repository->findForUser($existing->id, $userId, $admin) ?? $existing;
            }

            $model = $this->repository->save(new ConversationModel([
                'type' => $type,
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
            $participantIds = collect($data['participant_ids'] ?? [])
                ->map(fn ($id) => (string) $id)
                ->filter()
                ->unique()
                ->values();

            if ($type === 'store') {
                $participantIds = $participantIds->merge($this->storeOperatorIds());
            }

            $participantIds->push($adminId);
            $participantIds = $participantIds->map(fn ($id) => (string) $id)->filter()->unique()->values();

            $existing = $this->findMatchingConversation($type, null, $participantIds);

            if ($existing) {
                return $this->repository->findForUser($existing->id, $adminId, true) ?? $existing;
            }

            $model = $this->repository->save(new ConversationModel([
                'type' => $type,
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
        ])->load(['sender:id,name,avatar', 'conversation:id,type,subject,target_role', 'conversation.participants:id']);

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

    private function orderParticipants(int $orderId, string $userId, bool $admin): Collection
    {
        $order = DB::table('orders')->where('id', $orderId)->first(['user_id']);
        if (! $order) {
            throw new InvalidArgumentException('Order untuk percakapan tidak ditemukan.');
        }

        $buyerId = (string) $order->user_id;
        $operatorIds = $this->storeOperatorIds();

        if (! $admin && $buyerId !== $userId && ! $operatorIds->contains($userId)) {
            throw new InvalidArgumentException('Anda tidak terlibat dalam order tersebut.');
        }

        return collect([$buyerId])->merge($operatorIds);
    }

    /**
     * @return Collection<int, string>
     */
    private function storeOperatorIds(): Collection
    {
        return DB::table('user_roles')
            ->join('roles', 'roles.id', '=', 'user_roles.role_id')
            ->join('users', 'users.id', '=', 'user_roles.user_id')
            ->whereIn('roles.name', ['admin', 'super_admin'])
            ->where('roles.is_active', true)
            ->where('users.is_active', true)
            ->whereNull('users.deleted_at')
            ->distinct()
            ->pluck('users.id')
            ->map(fn ($id): string => (string) $id);
    }

    private function assertCustomer(string $buyerId): void
    {
        $isCustomer = DB::table('orders')
            ->where('user_id', $buyerId)
            ->whereNotIn('status', ['cancelled'])
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

    private function findMatchingConversation(string $type, ?int $orderId, Collection $participantIds): ?ConversationModel
    {
        $ids = $participantIds->values()->all();

        return ConversationModel::query()
            ->where('type', $type)
            ->when($orderId, fn (Builder $query) => $query->where('order_id', $orderId), fn (Builder $query) => $query->whereNull('order_id'))
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
            ], $userId);
        } catch (Throwable $exception) {
            Log::warning('Admin chat notification skipped.', [
                'conversation_id' => $conversation->id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
