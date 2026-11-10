<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Persistence\Repositories;

use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class EloquentRoleRepository implements RoleRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Role::query()
            ->with('permissions:id,name,is_active')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findById(int $id): ?Role
    {
        return Role::query()
            ->with('permissions:id,name,is_active')
            ->find($id);
    }

    public function nameExists(string $name, ?int $ignoreId = null): bool
    {
        return Role::withTrashed()
            ->where('name', Str::lower(trim($name)))
            ->when($ignoreId !== null, fn (Builder $query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    public function save(Role $role, ?array $permissionIds = null): Role
    {
        return DB::transaction(function () use ($role, $permissionIds): Role {
            $role->save();

            if ($permissionIds !== null) {
                $activePermissionIds = DB::table('permissions')
                    ->whereIn('id', array_map('intval', $permissionIds))
                    ->where('is_active', true)
                    ->pluck('id')
                    ->all();
                $role->permissions()->sync($activePermissionIds);
            }

            return $role->refresh()->load('permissions:id,name,is_active');
        });
    }

    public function delete(int $id): bool
    {
        $role = Role::query()->find($id);

        if (! $role) {
            return false;
        }

        return DB::transaction(function () use ($role): bool {
            $role->users()->detach();
            $role->permissions()->detach();

            return (bool) $role->delete();
        });
    }
}
