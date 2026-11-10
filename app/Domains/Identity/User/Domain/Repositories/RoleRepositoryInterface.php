<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Domain\Repositories;

use App\Domains\Identity\User\Domain\Entities\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RoleRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Role;

    public function nameExists(string $name, ?int $ignoreId = null): bool;

    public function save(Role $role, ?array $permissionIds = null): Role;

    public function delete(int $id): bool;
}
