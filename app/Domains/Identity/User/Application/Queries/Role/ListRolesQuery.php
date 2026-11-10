<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Queries\Role;

use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListRolesQuery
{
    public function __construct(private RoleRepositoryInterface $repository) {}

    public function execute(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }
}
