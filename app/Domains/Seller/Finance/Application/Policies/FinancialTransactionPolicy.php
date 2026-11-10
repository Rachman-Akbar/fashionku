<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Policies;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;

final class FinancialTransactionPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super_admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('finance.manage');
    }

    public function view(User $user, FinancialTransactionModel $transaction): bool
    {
        return $this->ownsStore($user, $transaction->store_id);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('finance.manage');
    }

    public function update(User $user, FinancialTransactionModel $transaction): bool
    {
        return $this->ownsStore($user, $transaction->store_id);
    }

    public function delete(User $user, FinancialTransactionModel $transaction): bool
    {
        return $this->ownsStore($user, $transaction->store_id);
    }

    private function ownsStore(User $user, ?int $storeId): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasPermission('finance.manage')
            && $storeId !== null
            && (int) $user->store?->id === $storeId;
    }
}
