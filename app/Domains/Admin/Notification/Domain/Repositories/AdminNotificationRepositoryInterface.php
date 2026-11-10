<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Domain\Repositories;

use App\Domains\Admin\Notification\Infrastructure\Persistence\Models\AdminNotificationModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdminNotificationRepositoryInterface
{
    public function paginateForUser(string $userId, array $filters, int $perPage): LengthAwarePaginator;

    public function findForUser(int $id, string $userId): ?AdminNotificationModel;

    public function save(AdminNotificationModel $model): AdminNotificationModel;

    public function unreadCount(string $userId): int;

    public function moduleUnreadCounts(string $userId): array;

    public function markAllRead(string $userId, ?string $module = null): int;

    public function deleteForUser(int $id, string $userId): bool;

    public function deleteAllForUser(string $userId, ?string $module = null): int;
}
