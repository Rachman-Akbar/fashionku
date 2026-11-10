<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Application\Policies;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketModel;

final class TicketPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super_admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('tickets.create') || $user->hasPermission('tickets.manage');
    }

    public function view(User $user, SupportTicketModel $ticket): bool
    {
        return $user->hasPermission('tickets.manage') || $ticket->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('tickets.create');
    }

    public function update(User $user, SupportTicketModel $ticket): bool
    {
        return $user->hasPermission('tickets.manage') || $ticket->user_id === $user->id;
    }

    public function delete(User $user): bool
    {
        return $user->hasPermission('tickets.manage');
    }
}
