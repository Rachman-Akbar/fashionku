<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Application\Policies;

use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use App\Domains\Identity\User\Domain\Entities\User;

final class ConversationPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super_admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('chat.use') || $user->hasPermission('announcements.manage');
    }

    public function view(User $user, ConversationModel $conversation): bool
    {
        return $user->hasPermission('announcements.manage') || $conversation->participants()
            ->where('users.id', $user->id)
            ->wherePivotNull('left_at')
            ->exists();
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('chat.use');
    }

    public function announce(User $user): bool
    {
        return $user->hasPermission('announcements.manage');
    }
}
