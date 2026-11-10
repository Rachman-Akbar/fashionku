<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\UseCases\Role;

use App\Domains\Identity\User\Application\DTOs\RoleData;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class UpdateRoleUseCase
{
    public function __construct(private RoleRepositoryInterface $repository) {}

    public function execute(int $id, RoleData $data): ?Role
    {
        $role = $this->repository->findById($id);

        if (! $role) {
            return null;
        }

        if ($data->hasName) {
            $name = Str::lower(trim((string) $data->name));

            if ($this->repository->nameExists($name, $id)) {
                throw new InvalidArgumentException('Nama role sudah digunakan.');
            }

            $role->name = $name;
        }

        if ($data->hasDescription) {
            $role->description = $data->description;
        }

        if ($data->hasIsActive) {
            $role->is_active = (bool) $data->isActive;
        }

        return $this->repository->save(
            $role,
            $data->hasPermissionIds ? ($data->permissionIds ?? []) : null
        );
    }
}
