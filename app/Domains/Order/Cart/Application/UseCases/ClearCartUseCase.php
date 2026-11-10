<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\UseCases;

use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;

final class ClearCartUseCase
{
    public function __construct(
        private readonly CartRepositoryInterface $cartRepository
    ) {}

    public function execute(string $userId): CartSummaryData
    {
        $this->cartRepository->delete($userId);

        return new CartSummaryData([], 0, 0);
    }
}
