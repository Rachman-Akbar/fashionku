<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Application\Services;

use App\Domains\Admin\Notification\Domain\Repositories\AdminNotificationRepositoryInterface;
use App\Domains\Admin\Notification\Infrastructure\Persistence\Models\AdminNotificationModel;
use App\Domains\Admin\Notification\Presentation\Events\AdminNotificationCreated;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class AdminNotificationService
{
    private const RECIPIENTS_CACHE_KEY = 'admin.notification.recipients';

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

    public function notifyAdmins(array $data, ?string $actorId = null): Collection
    {
        // Daftar penerima admin relatif statis; cache singkat agar setiap
        // notifikasi tidak menjalankan query join 3 tabel.
        //
        // Disimpan sebagai array skalar (bukan Collection): `config/cache.php`
        // menetapkan `serializable_classes => false`, sehingga objek yang
        // di-cache tidak bisa di-unserialize saat cache hit dan berubah
        // menjadi __PHP_Incomplete_Class. Cache lama yang bukan array
        // diabaikan dan langsung ditimpa.
        $adminIds = Cache::get(self::RECIPIENTS_CACHE_KEY);

        if (! is_array($adminIds)) {
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
                ->map(fn ($id): string => (string) $id)
                ->values()
                ->all();

            Cache::put(self::RECIPIENTS_CACHE_KEY, $adminIds, 60);
        }

        return $this->notifyAdminUsers($adminIds, $data, $actorId);
    }

    public function notifyAdminUsers(iterable $userIds, array $data, ?string $actorId = null): Collection
    {
        $required = ['module', 'type', 'title'];
        foreach ($required as $key) {
            if (trim((string) ($data[$key] ?? '')) === '') {
                throw new InvalidArgumentException("Field notifikasi {$key} wajib diisi.");
            }
        }

        $recipients = collect($userIds)
            ->map(fn ($id): string => (string) $id)
            ->filter()
            ->unique()
            ->values();

        if ($recipients->isEmpty()) {
            return collect();
        }

        $now = now();
        $module = trim((string) $data['module']);
        $type = trim((string) $data['type']);
        $title = trim((string) $data['title']);
        $message = isset($data['message']) ? trim((string) $data['message']) : null;
        $referenceType = $data['reference_type'] ?? null;
        $referenceId = isset($data['reference_id']) ? (string) $data['reference_id'] : null;
        $url = $data['url'] ?? null;
        $meta = $data['meta'] ?? null;
        $meta = is_array($meta) || is_object($meta)
            ? json_encode($meta, JSON_UNESCAPED_UNICODE)
            : $meta;

        $rows = $recipients->map(fn (string $userId): array => [
            'user_id' => $userId,
            'actor_id' => $actorId,
            'module' => $module,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'url' => $url,
            'meta' => $meta,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ])->values()->all();

        // Satu INSERT massal (bukan satu query per penerima), lalu satu SELECT
        // untuk mengambil kembali model yang dibutuhkan event broadcast.
        $lastIdBefore = (int) DB::table('admin_notifications')->max('id');
        AdminNotificationModel::query()->insert($rows);

        $models = AdminNotificationModel::query()
            ->with(['actor:id,name,avatar'])
            ->whereIn('user_id', $recipients->all())
            ->where('module', $module)
            ->where('type', $type)
            ->where('title', $title)
            ->where('created_at', $now->toDateTimeString())
            ->where('id', '>', $lastIdBefore)
            ->orderBy('id')
            ->get();

        $broadcast = function () use ($models): void {
            $models->each(fn (AdminNotificationModel $row) => AdminNotificationCreated::dispatch($row));
        };

        if (DB::transactionLevel() > 0) {
            DB::afterCommit($broadcast);
        } else {
            $broadcast();
        }

        return $models;
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
