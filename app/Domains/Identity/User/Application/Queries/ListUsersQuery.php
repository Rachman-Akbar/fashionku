<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Application\Queries;

use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListUsersQuery
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(int $perPage = 15): LengthAwarePaginator
    {
        return $this->userRepository->paginate($perPage);
    }
}
