<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Queries;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Exceptions\UserNotFoundException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;

class GetUserQuery
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(string $id): User
    {
        $user = $this->userRepository->findById($id);

        if (! $user) {
            throw new UserNotFoundException("User with ID {$id} not found.");
        }

        return $user;
    }
}
