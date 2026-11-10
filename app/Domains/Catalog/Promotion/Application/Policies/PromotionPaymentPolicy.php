<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Policies;

use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use App\Domains\Identity\User\Domain\Entities\User;

final class PromotionPaymentPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super_admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('promotion_payments.submit') || $user->hasPermission('promotion_payments.review');
    }

    public function view(User $user, PromotionPaymentModel $payment): bool
    {
        return $user->hasPermission('promotion_payments.review') || (
            $user->hasPermission('promotion_payments.submit')
            && (int) $user->store?->id === (int) $payment->store_id
        );
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('promotion_payments.submit');
    }

    public function review(User $user): bool
    {
        return $user->hasPermission('promotion_payments.review');
    }
}
