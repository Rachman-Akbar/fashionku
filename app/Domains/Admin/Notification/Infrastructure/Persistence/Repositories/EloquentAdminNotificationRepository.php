<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Infrastructure\Persistence\Repositories;

use App\Domains\Admin\Notification\Domain\Repositories\AdminNotificationRepositoryInterface;
use App\Domains\Admin\Notification\Infrastructure\Persistence\Models\AdminNotificationModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class EloquentAdminNotificationRepository implements AdminNotificationRepositoryInterface
{
    public function paginateForUser(string $userId, array $filters, int $perPage): LengthAwarePaginator
    {
        return AdminNotificationModel::query()
            ->with(['actor:id,name,avatar', 'store:id,name,logo'])
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->when($filters['module'] ?? null, fn ($query, $module) => $query->where('module', $module))
            ->when(($filters['unread'] ?? null) !== null, function ($query) use ($filters): void {
                filter_var($filters['unread'], FILTER_VALIDATE_BOOL)
                    ? $query->whereNull('read_at')
                    : $query->whereNotNull('read_at');
            })
            ->latest('id')
            ->paginate($perPage);
    }

    public function findForUser(int $id, string $userId): ?AdminNotificationModel
    {
        return AdminNotificationModel::query()
            ->with(['actor:id,name,avatar', 'store:id,name,logo'])
            ->where('user_id', $userId)
            ->whereKey($id)
            ->first();
    }

    public function save(AdminNotificationModel $model): AdminNotificationModel
    {
        $model->save();

        return $model->refresh()->load(['actor:id,name,avatar', 'store:id,name,logo']);
    }

    public function unreadCount(string $userId): int
    {
        return AdminNotificationModel::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->whereNull('read_at')
            ->count();
    }

    public function moduleUnreadCounts(string $userId): array
    {
        return AdminNotificationModel::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->whereNull('read_at')
            ->selectRaw('module, COUNT(*) as aggregate')
            ->groupBy('module')
            ->pluck('aggregate', 'module')
            ->map(fn ($value): int => (int) $value)
            ->all();
    }

    public function markAllRead(string $userId, ?string $module = null): int
    {
        return AdminNotificationModel::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->whereNull('read_at')
            ->when($module, fn ($query) => $query->where('module', $module))
            ->update(['read_at' => now(), 'updated_at' => now()]);
    }

    public function deleteForUser(int $id, string $userId): bool
    {
        return (bool) AdminNotificationModel::query()
            ->where('user_id', $userId)
            ->whereKey($id)
            ->delete();
    }

    public function deleteAllForUser(string $userId, ?string $module = null): int
    {
        return AdminNotificationModel::query()
            ->where('user_id', $userId)
            ->when($module, fn ($query) => $query->where('module', $module))
            ->delete();
    }
}
