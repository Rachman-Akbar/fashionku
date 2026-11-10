<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\UseCases;

use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;

final class GetCartUseCase
{
    public function __construct(
        private CartRepositoryInterface $cartRepository
    ) {}

    public function execute(string $userId): CartSummaryData
    {
        return $this->cartRepository->getSummary($userId);
    }
}
