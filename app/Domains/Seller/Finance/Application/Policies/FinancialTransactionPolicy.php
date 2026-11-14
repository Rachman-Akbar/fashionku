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
        return $this->canManage($user);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('finance.manage');
    }

    public function update(User $user, FinancialTransactionModel $transaction): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, FinancialTransactionModel $transaction): bool
    {
        return $this->canManage($user);
    }

    private function canManage(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasPermission('finance.manage');
    }
}
