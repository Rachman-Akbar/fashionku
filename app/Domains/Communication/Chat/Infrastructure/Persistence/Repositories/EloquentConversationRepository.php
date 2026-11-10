<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Infrastructure\Persistence\Repositories;

use App\Domains\Communication\Chat\Domain\Repositories\ConversationRepositoryInterface;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentConversationRepository implements ConversationRepositoryInterface
{
    public function paginateForUser(string $userId, array $filters, int $perPage, bool $admin): LengthAwarePaginator
    {
        return ConversationModel::query()
            ->with(['store:id,user_id,name,logo', 'order:id,order_number,status', 'participants:id,name,avatar', 'latestMessage.sender:id,name,avatar'])
            ->withCount(['messages as unread_count' => function (Builder $query) use ($userId): void {
                $query->where('sender_id', '!=', $userId)
                    ->whereDoesntHave('readers', fn (Builder $readerQuery) => $readerQuery->where('users.id', $userId));
            }])
            ->when(! $admin, fn (Builder $query) => $query->whereHas('participants', fn (Builder $participantQuery) => $participantQuery->where('users.id', $userId)->whereNull('conversation_participants.left_at')))
            ->when(! empty($filters['type']), fn (Builder $query) => $query->where('type', $filters['type']))
            ->when(! empty($filters['store_id']), fn (Builder $query) => $query->where('store_id', (int) $filters['store_id']))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('subject', 'like', "%{$search}%")
                        ->orWhereHas('participants', fn (Builder $participantQuery) => $participantQuery->where('users.name', 'like', "%{$search}%"));
                });
            })
            ->latest('updated_at')
            ->paginate($perPage);
    }

    public function findForUser(int $id, string $userId, bool $admin): ?ConversationModel
    {
        return ConversationModel::query()
            ->with(['store:id,user_id,name,logo', 'order:id,order_number,status', 'participants:id,name,avatar', 'messages.sender:id,name,avatar', 'messages.readers:id,name'])
            ->when(! $admin, fn (Builder $query) => $query->whereHas('participants', fn (Builder $participantQuery) => $participantQuery->where('users.id', $userId)->whereNull('conversation_participants.left_at')))
            ->find($id);
    }

    public function save(ConversationModel $model): ConversationModel
    {
        $model->save();

        return $model->refresh()->load(['store:id,user_id,name,logo', 'order:id,order_number,status', 'participants:id,name,avatar', 'messages.sender:id,name,avatar']);
    }
}
