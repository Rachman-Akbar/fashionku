<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Application\Policies;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Stock\Infrastructure\Persistence\Models\StockMovementModel;

final class StockMovementPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super_admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('stock.manage');
    }

    public function view(User $user, StockMovementModel $movement): bool
    {
        return $this->ownsStore($user, (int) $movement->store_id);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('stock.manage');
    }

    private function ownsStore(User $user, int $storeId): bool
    {
        return $user->hasRole('admin') || (
            $user->hasPermission('stock.manage')
            && (int) $user->store?->id === $storeId
        );
    }
}
