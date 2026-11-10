<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Domain\Repositories;

use App\Domains\Identity\Auth\Application\DTOs\RegisterSellerDTO;
use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Application\DTOs\UpdateUserDTO;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findById(string $id): ?User;

    public function findByEmail(string $email): ?User;

    public function findAnyByEmail(string $email): ?User;

    public function findByFirebaseUid(string $firebaseUid): ?User;

    public function findAnyByFirebaseUid(string $firebaseUid): ?User;

    public function create(CreateUserDTO $dto): User;

    public function update(string $id, UpdateUserDTO $dto): ?User;

    public function delete(string $id): bool;

    public function syncFromFirebase(array $firebaseUser): User;

    public function assignRoleByName(User $user, string $role): void;

    public function getActiveRoleFromCurrentToken(User $user): ?string;

    public function resolveDefaultActiveRole(User $user): ?string;

    public function registerStore(string $userId, RegisterSellerDTO $dto): int;

    public function hasSellerAccess(User $user): bool;

    public function deleteCurrentToken(User $user): void;

    public function logoutOtherDevices(User $user): int;
}
