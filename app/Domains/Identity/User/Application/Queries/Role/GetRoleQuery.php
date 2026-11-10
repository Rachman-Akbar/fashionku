<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Queries\Role;

use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;

final class GetRoleQuery
{
    public function __construct(private RoleRepositoryInterface $repository) {}

    public function execute(int $id): ?Role
    {
        return $this->repository->findById($id);
    }
}
