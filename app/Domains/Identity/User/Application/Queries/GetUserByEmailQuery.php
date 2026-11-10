<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Queries;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Exceptions\UserNotFoundException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;

class GetUserByEmailQuery
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(string $email): User
    {
        $user = $this->userRepository->findByEmail($email);

        if (! $user) {
            throw new UserNotFoundException("User with email {$email} not found.");
        }

        return $user;
    }
}
