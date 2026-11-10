<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Infrastructure\Persistence\Repositories;

use App\Domains\Support\Ticket\Domain\Repositories\TicketRepositoryInterface;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentTicketRepository implements TicketRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?string $ownerId): LengthAwarePaginator
    {
        return SupportTicketModel::query()
            ->with(['user:id,name,email', 'store:id,name', 'order:id,order_number', 'assignee:id,name,email'])
            ->withCount(['messages' => fn (Builder $query) => $query->when($ownerId !== null, fn (Builder $messageQuery) => $messageQuery->where('is_internal', false))])
            ->when($ownerId !== null, fn (Builder $query) => $query->where('user_id', $ownerId))
            ->when(! empty($filters['status']), fn (Builder $query) => $query->where('status', $filters['status']))
            ->when(! empty($filters['priority']), fn (Builder $query) => $query->where('priority', $filters['priority']))
            ->when(! empty($filters['category']), fn (Builder $query) => $query->where('category', $filters['category']))
            ->when(trim((string) ($filters['search'] ?? '')) !== '', function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('ticket_number', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest('last_replied_at')
            ->latest('id')
            ->paginate($perPage);
    }

    public function find(int $id, ?string $ownerId): ?SupportTicketModel
    {
        return SupportTicketModel::query()
            ->with([
                'user:id,name,email',
                'store:id,name',
                'order:id,order_number',
                'assignee:id,name,email',
                'messages' => fn (Builder $query) => $query
                    ->when($ownerId !== null, fn (Builder $messageQuery) => $messageQuery->where('is_internal', false))
                    ->with('user:id,name,email'),
            ])
            ->when($ownerId !== null, fn (Builder $query) => $query->where('user_id', $ownerId))
            ->find($id);
    }

    public function save(SupportTicketModel $model): SupportTicketModel
    {
        $model->save();

        return $model->refresh()->load(['user:id,name,email', 'store:id,name', 'order:id,order_number', 'assignee:id,name,email', 'messages.user:id,name,email'])->loadCount('messages');
    }

    public function delete(SupportTicketModel $model): bool
    {
        return (bool) $model->delete();
    }
}
