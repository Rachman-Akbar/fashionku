<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Application\Services;

use App\Domains\Admin\Notification\Domain\Repositories\AdminNotificationRepositoryInterface;
use App\Domains\Admin\Notification\Infrastructure\Persistence\Models\AdminNotificationModel;
use App\Domains\Admin\Notification\Presentation\Events\AdminNotificationCreated;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class AdminNotificationService
{
    public function __construct(private AdminNotificationRepositoryInterface $repository) {}

    public function paginate(string $userId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repository->paginateForUser($userId, $filters, $perPage);
    }

    public function state(string $userId): array
    {
        return [
            'unread_count' => $this->repository->unreadCount($userId),
            'module_counts' => $this->repository->moduleUnreadCounts($userId),
        ];
    }

    public function notifyAdmins(array $data, ?string $actorId = null, ?int $storeId = null): Collection
    {
        $adminIds = DB::table('users')
            ->join('user_roles', 'user_roles.user_id', '=', 'users.id')
            ->join('roles', 'roles.id', '=', 'user_roles.role_id')
            ->whereIn('roles.name', ['admin', 'super_admin'])
            ->where('roles.is_active', true)
            ->where('users.is_active', true)
            ->whereNull('users.banned_at')
            ->whereNull('users.deleted_at')
            ->distinct()
            ->pluck('users.id')
            ->map(fn ($id): string => (string) $id);

        return $this->notifyAdminUsers($adminIds, $data, $actorId, $storeId);
    }

    public function notifyAdminUsers(iterable $userIds, array $data, ?string $actorId = null, ?int $storeId = null): Collection
    {
        $required = ['module', 'type', 'title'];
        foreach ($required as $key) {
            if (trim((string) ($data[$key] ?? '')) === '') {
                throw new InvalidArgumentException("Field notifikasi {$key} wajib diisi.");
            }
        }

        $rows = collect($userIds)
            ->map(fn ($id): string => (string) $id)
            ->filter()
            ->unique()
            ->map(function (string $userId) use ($data, $actorId, $storeId): AdminNotificationModel {
                return $this->repository->save(new AdminNotificationModel([
                    'user_id' => $userId,
                    'actor_id' => $actorId,
                    'store_id' => $storeId,
                    'module' => trim((string) $data['module']),
                    'type' => trim((string) $data['type']),
                    'title' => trim((string) $data['title']),
                    'message' => isset($data['message']) ? trim((string) $data['message']) : null,
                    'reference_type' => $data['reference_type'] ?? null,
                    'reference_id' => isset($data['reference_id']) ? (string) $data['reference_id'] : null,
                    'url' => $data['url'] ?? null,
                    'meta' => $data['meta'] ?? null,
                    'is_active' => true,
                ]));
            })
            ->values();

        $broadcast = function () use ($rows): void {
            $rows->each(fn (AdminNotificationModel $row) => AdminNotificationCreated::dispatch($row));
        };

        if (DB::transactionLevel() > 0) {
            DB::afterCommit($broadcast);
        } else {
            $broadcast();
        }

        return $rows;
    }

    public function markRead(int $id, string $userId): AdminNotificationModel
    {
        $model = $this->repository->findForUser($id, $userId)
            ?? throw new InvalidArgumentException('Notifikasi tidak ditemukan.');

        if ($model->read_at === null) {
            $model->read_at = now();

            return $this->repository->save($model);
        }

        return $model;
    }

    public function markAllRead(string $userId, ?string $module = null): array
    {
        $updated = $this->repository->markAllRead($userId, $module);

        return [
            'updated' => $updated,
            ...$this->state($userId),
        ];
    }

    public function delete(int $id, string $userId): void
    {
        if (! $this->repository->deleteForUser($id, $userId)) {
            throw new InvalidArgumentException('Notifikasi tidak ditemukan.');
        }
    }

    public function deleteAll(string $userId, ?string $module = null): array
    {
        $deleted = $this->repository->deleteAllForUser($userId, $module);

        return [
            'deleted' => $deleted,
            ...$this->state($userId),
        ];
    }
}
