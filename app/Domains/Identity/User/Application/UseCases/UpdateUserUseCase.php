<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\UseCases;

use App\Domains\Identity\User\Application\DTOs\UpdateUserDTO;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Domains\Identity\User\Domain\Exceptions\UserNotFoundException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;

final class UpdateUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(string $id, UpdateUserDTO $dto): User
    {
        $user = $this->userRepository->findById($id);

        if (! $user) {
            throw new UserNotFoundException("User with ID {$id} not found.");
        }

        if ($dto->email !== null && strtolower(trim($dto->email)) !== strtolower((string) $user->email)) {
            $existingUser = $this->userRepository->findAnyByEmail($dto->email);

            if ($existingUser) {
                throw new EmailAlreadyExistsException("Email {$dto->email} is already taken.");
            }

            $dto->isEmailVerified = false;
        }

        return $this->userRepository->update($id, $dto)
            ?? throw new UserNotFoundException("User with ID {$id} not found.");
    }
}
