<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Application\UseCases;

use App\Domains\Finance\Commission\Application\Services\AdminFeeConfigService;
use App\Domains\Finance\Commission\Application\Services\SellerSettlementService;
use App\Domains\Finance\Commission\Domain\Entities\SellerSettlement;

class CalculateCommissionUseCase
{
    public function __construct(
        private AdminFeeConfigService $feeConfigService,
        private SellerSettlementService $settlementService
    ) {}

    /**
     * Hitung komisi dan catat settlement seller untuk sebuah sub-order.
     *
     * Idempotent: jika settlement untuk (order, sub-order) sudah ada maka
     * settlement yang ada dikembalikan tanpa membuat duplikat.
     */
    public function execute(
        int $orderId,
        int $storeId,
        int $subOrderId,
        float $subOrderAmount,
        float $shippingCost = 0.0,
        ?string $orderNumber = null,
        ?string $orderType = null,
        ?int $categoryId = null,
        ?string $buyerUserId = null,
    ): SellerSettlement {
        $existing = $this->settlementService->findByOrderAndSubOrder($orderId, $subOrderId);

        if ($existing !== null) {
            return $existing;
        }

        $adminFee = $this->feeConfigService->calculateFee($subOrderAmount, $categoryId);
        $netAmount = max(0.0, $subOrderAmount - $adminFee);

        return $this->settlementService->createSettlement([
            'store_id' => $storeId,
            'order_id' => $orderId,
            'sub_order_id' => $subOrderId,
            'settlement_number' => $this->generateSettlementNumber(),
            'gross_amount' => $subOrderAmount,
            'admin_fee' => $adminFee,
            'shipping_fee' => $shippingCost,
            'net_amount' => $netAmount,
            'status' => 'pending',
            'created_by' => $buyerUserId,
            'metadata' => [
                'order_number' => $orderNumber,
                'order_type' => $orderType,
            ],
        ]);
    }

    private function generateSettlementNumber(): string
    {
        return 'STL-'.date('Ymd').'-'.strtoupper(substr(uniqid(), -8));
    }
}
