<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Domain\Repositories;

use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TicketRepositoryInterface
{
    public function paginate(array $filters, int $perPage, ?string $ownerId): LengthAwarePaginator;

    public function find(int $id, ?string $ownerId): ?SupportTicketModel;

    public function save(SupportTicketModel $model): SupportTicketModel;

    public function delete(SupportTicketModel $model): bool;
}
