<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Domain\Repositories;

use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ConversationRepositoryInterface
{
    public function paginateForUser(string $userId, array $filters, int $perPage, bool $admin): LengthAwarePaginator;

    public function findForUser(int $id, string $userId, bool $admin): ?ConversationModel;

    public function save(ConversationModel $model): ConversationModel;
}
