<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\UseCases;

use App\Domains\Identity\User\Domain\Exceptions\UserNotFoundException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;

class DeleteUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(string $id): void
    {
        $deleted = $this->userRepository->delete($id);

        if (! $deleted) {
            throw new UserNotFoundException("User with ID {$id} not found.");
        }
    }
}
