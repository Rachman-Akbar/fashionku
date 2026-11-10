<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\UseCases;

use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;

final class RemoveItemFromCartUseCase
{
    public function __construct(
        private CartRepositoryInterface $cartRepository
    ) {}

    public function execute(string $userId, int $productVariantId): CartSummaryData
    {
        $this->cartRepository->removeItem($userId, $productVariantId);

        return $this->cartRepository->getSummary($userId);
    }
}
