<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Domain\Repositories;

use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Domain\Entities\Cart;

interface CartRepositoryInterface
{
    public function findByUserId(string $userId): ?Cart;

    public function createNewCart(string $userId): Cart;

    public function save(Cart $cart): void;

    public function delete(string $userId): void;

    public function removeItem(string $userId, int $productVariantId): void;

    public function getSummary(string $userId): CartSummaryData;
}
