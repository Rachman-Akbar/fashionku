<?php

declare(strict_types=1);

namespace App\Domains\Order\Review\Application\Policies;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;

final class ProductReviewPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasRole('super_admin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('reviews.create') || $user->hasPermission('reviews.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('reviews.create');
    }

    public function update(User $user, ProductReviewModel $review): bool
    {
        return $user->hasPermission('reviews.manage') || $review->user_id === $user->id;
    }

    public function delete(User $user, ProductReviewModel $review): bool
    {
        return $user->hasPermission('reviews.manage') || $review->user_id === $user->id;
    }
}
