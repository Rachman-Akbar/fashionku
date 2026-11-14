<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Application\Services;

use App\Domains\Seller\Finance\Domain\Repositories\FinancialTransactionRepositoryInterface;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialPaymentHistoryModel;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class FinancialTransactionService
{
    public function __construct(
        private FinancialTransactionRepositoryInterface $repository,
        private CodePatternService $codePatterns,
    ) {}

    public function paginate(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage);
    }

    public function find(int $id): FinancialTransactionModel
    {
        return $this->repository->find($id)
            ?? throw new InvalidArgumentException('Transaksi keuangan tidak ditemukan.');
    }

    public function save(array $data, ?int $id): FinancialTransactionModel
    {
        return DB::transaction(function () use ($data, $id): FinancialTransactionModel {
            $orderId = isset($data['order_id']) ? (int) $data['order_id'] : null;

            if (! $id && $orderId !== null && (string) $data['type'] === 'income') {
                $id = FinancialTransactionModel::query()
                    ->where('order_id', $orderId)
                    ->where('type', 'income')
                    ->value('id');
            }

            $model = $id ? $this->find($id) : new FinancialTransactionModel;

            if ($orderId !== null && ! DB::table('orders')->where('id', $orderId)->exists()) {
                throw new InvalidArgumentException('Order tidak ditemukan.');
            }

            $type = (string) $data['type'];
            $amount = round((float) $data['amount'], 2);
            $existingPaidAmount = $model->exists ? round((float) $model->paid_amount, 2) : 0.0;
            $existingType = $model->exists ? (string) $model->type : $type;
            $isDebt = in_array($type, ['payable', 'receivable'], true);
            $wasDebt = in_array($existingType, ['payable', 'receivable'], true);

            if ($model->exists && $existingPaidAmount > 0 && $existingType !== $type) {
                throw new InvalidArgumentException('Jenis transaksi tidak dapat diubah setelah memiliki riwayat pembayaran.');
            }

            if ($model->exists && $wasDebt && $amount < $existingPaidAmount) {
                throw new InvalidArgumentException('Nominal transaksi tidak boleh lebih kecil dari total pembayaran yang sudah tercatat.');
            }

            $paidAmount = $isDebt
                ? ($model->exists && $wasDebt
                    ? $existingPaidAmount
                    : min($amount, max(0, round((float) ($data['paid_amount'] ?? 0), 2))))
                : 0.0;
            $status = $this->resolveStatus($type, $amount, $paidAmount, (string) ($data['status'] ?? 'open'));
            $providedReference = trim((string) ($data['reference_number'] ?? ''));

            $model->fill([
                'order_id' => $orderId,
                'user_id' => $data['user_id'] ?? null,
                'reference_number' => $model->reference_number ?: ($providedReference !== '' ? $providedReference : $this->referenceNumber($type)),
                'type' => $type,
                'category' => trim((string) ($data['category'] ?? '')) !== '' ? (string) $data['category'] : ($type === 'income' ? 'penjualan' : 'lainnya'),
                'title' => trim((string) $data['title']),
                'description' => $data['description'] ?? null,
                'amount' => $amount,
                'paid_amount' => $paidAmount,
                'status' => $status,
                'due_date' => $data['due_date'] ?? null,
                'occurred_at' => $data['occurred_at'],
                'settled_at' => $status === 'paid' ? now() : null,
                'is_active' => $data['is_active'] ?? true,
                'metadata' => $data['metadata'] ?? null,
            ]);

            $saved = $this->repository->save($model);

            if (! $id && $isDebt && $paidAmount > 0) {
                FinancialPaymentHistoryModel::query()->create([
                    'financial_transaction_id' => $saved->id,
                    'recorded_by' => auth()->id(),
                    'amount' => $paidAmount,
                    'balance_before' => $amount,
                    'balance_after' => max(0, $amount - $paidAmount),
                    'payment_method' => 'opening_balance',
                    'reference_number' => null,
                    'notes' => 'Pembayaran awal saat transaksi dibuat.',
                    'paid_at' => $saved->occurred_at ?? now(),
                ]);
            }

            return $saved;
        });
    }

    public function recordPayment(int $id, float $amount, array $paymentData = []): FinancialTransactionModel
    {
        return DB::transaction(function () use ($id, $amount, $paymentData): FinancialTransactionModel {
            $model = FinancialTransactionModel::query()
                ->lockForUpdate()
                ->find($id);

            if (! $model) {
                throw new InvalidArgumentException('Transaksi keuangan tidak ditemukan.');
            }

            if (! in_array($model->type, ['payable', 'receivable'], true)) {
                throw new InvalidArgumentException('Pembayaran hanya berlaku untuk hutang atau piutang.');
            }

            $balanceBefore = max(0, (float) $model->amount - (float) $model->paid_amount);
            $paymentAmount = min($balanceBefore, max(0, $amount));
            if ($paymentAmount <= 0) {
                throw new InvalidArgumentException('Transaksi sudah lunas atau nominal pembayaran tidak valid.');
            }
            $model->paid_amount = min((float) $model->amount, (float) $model->paid_amount + $paymentAmount);
            $model->status = $this->resolveStatus($model->type, (float) $model->amount, (float) $model->paid_amount, $model->status);
            $model->settled_at = $model->status === 'paid' ? now() : null;

            $saved = $this->repository->save($model);
            FinancialPaymentHistoryModel::query()->create([
                'financial_transaction_id' => $saved->id,
                'recorded_by' => auth()->id(),
                'amount' => $paymentAmount,
                'balance_before' => $balanceBefore,
                'balance_after' => max(0, (float) $saved->amount - (float) $saved->paid_amount),
                'payment_method' => $paymentData['payment_method'] ?? 'manual',
                'reference_number' => $paymentData['reference_number'] ?? null,
                'notes' => $paymentData['notes'] ?? null,
                'paid_at' => $paymentData['paid_at'] ?? now(),
            ]);

            return $saved;
        });
    }

    public function paymentHistory(int $id)
    {
        $this->find($id);

        return FinancialPaymentHistoryModel::query()->where('financial_transaction_id', $id)->latest('paid_at')->get();
    }

    public function delete(int $id): void
    {
        $this->repository->delete($this->find($id));
    }

    private function resolveStatus(string $type, float $amount, float $paidAmount, string $requested): string
    {
        if (! in_array($type, ['payable', 'receivable'], true)) {
            return in_array($requested, ['draft', 'posted', 'cancelled'], true) ? $requested : 'posted';
        }

        if ($requested === 'cancelled') {
            return 'cancelled';
        }

        if ($paidAmount <= 0) {
            return 'open';
        }

        return $paidAmount >= $amount ? 'paid' : 'partial';
    }

    private function referenceNumber(string $type): string
    {
        return $this->codePatterns->unique('invoice_reference', [
            'type' => $type,
            'seq' => $this->codePatterns->sequenceFor('financial_transactions', 'created_at'),
        ], fn (string $candidate): bool => FinancialTransactionModel::query()->where('reference_number', $candidate)->exists());
    }
}
