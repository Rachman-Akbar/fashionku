<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\UseCases;

use App\Domains\Identity\User\Application\DTOs\CreateUserDTO;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Identity\User\Domain\Exceptions\EmailAlreadyExistsException;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;

final class CreateUserUseCase
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(CreateUserDTO $dto): User
    {
        if ($this->userRepository->findAnyByEmail($dto->email)) {
            throw new EmailAlreadyExistsException("User with email {$dto->email} already exists.");
        }

        return $this->userRepository->create($dto);
    }
}
