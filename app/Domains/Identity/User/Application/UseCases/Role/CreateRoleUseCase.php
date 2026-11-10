<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\UseCases\Role;

use App\Domains\Identity\User\Application\DTOs\RoleData;
use App\Domains\Identity\User\Domain\Entities\Role;
use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class CreateRoleUseCase
{
    public function __construct(private RoleRepositoryInterface $repository) {}

    public function execute(RoleData $data): Role
    {
        $name = Str::lower(trim((string) $data->name));

        if ($this->repository->nameExists($name)) {
            throw new InvalidArgumentException('Nama role sudah digunakan.');
        }

        return $this->repository->save(new Role([
            'name' => $name,
            'description' => $data->description,
            'is_active' => $data->isActive ?? true,
        ]), $data->permissionIds ?? []);
    }
}
