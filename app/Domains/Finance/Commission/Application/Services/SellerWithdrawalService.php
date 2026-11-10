<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Application\Services;

use App\Domains\Finance\Commission\Domain\Entities\SellerWithdrawal;
use App\Domains\Finance\Commission\Domain\Repositories\SellerWithdrawalRepositoryInterface;
use DomainException;

class SellerWithdrawalService
{
    public function __construct(
        private SellerWithdrawalRepositoryInterface $repository,
        private SellerSettlementService $settlementService
    ) {}

    public function requestWithdrawal(array $data): SellerWithdrawal
    {
        $availableBalance = $this->settlementService->getStoreBalance($data['store_id']);

        if ($availableBalance < $data['amount']) {
            throw new DomainException('Saldo tidak mencukupi untuk penarikan.');
        }

        return $this->repository->create($data);
    }

    public function approveWithdrawal(int $id, string $processedBy): SellerWithdrawal
    {
        $withdrawal = $this->repository->findById($id);

        if (! $withdrawal) {
            throw new DomainException('Data penarikan tidak ditemukan.');
        }

        if ($withdrawal->status !== 'pending') {
            throw new DomainException('Hanya penarikan pending yang dapat disetujui.');
        }

        $this->settlementService->settlePendingSettlements($withdrawal->storeId);

        return $this->repository->update($id, [
            'status' => 'approved',
            'processed_at' => now()->toDateTimeString(),
            'processed_by' => $processedBy,
        ]);
    }

    public function rejectWithdrawal(int $id, string $reason, string $processedBy): SellerWithdrawal
    {
        $withdrawal = $this->repository->findById($id);

        if (! $withdrawal) {
            throw new DomainException('Data penarikan tidak ditemukan.');
        }

        if ($withdrawal->status !== 'pending') {
            throw new DomainException('Hanya penarikan pending yang dapat ditolak.');
        }

        return $this->repository->update($id, [
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'processed_at' => now()->toDateTimeString(),
            'processed_by' => $processedBy,
        ]);
    }

    public function getStoreWithdrawals(int $storeId, array $filters = [], int $perPage = 20): mixed
    {
        return $this->repository->getByStore($storeId, $filters, $perPage);
    }

    public function getAllWithdrawals(array $filters = [], int $perPage = 20): mixed
    {
        return $this->repository->getAll($filters, $perPage);
    }

    public function getPendingCount(): int
    {
        return $this->repository->getPendingCount();
    }

    public function getTotalWithdrawn(int $storeId): float
    {
        return $this->repository->getTotalWithdrawn($storeId);
    }

    public function getById(int $id): ?SellerWithdrawal
    {
        return $this->repository->findById($id);
    }
}
