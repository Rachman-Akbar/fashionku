<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\UseCases\Role;

use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;

final class DeleteRoleUseCase
{
    public function __construct(private RoleRepositoryInterface $repository) {}

    public function execute(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
