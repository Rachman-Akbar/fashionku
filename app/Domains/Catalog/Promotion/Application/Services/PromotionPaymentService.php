<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Services;

use App\Domains\Admin\Notification\Application\Services\AdminNotificationService;
use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionPaymentRepositoryInterface;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class PromotionPaymentService
{
    public function __construct(
        private PromotionPaymentRepositoryInterface $repository,
        private AdminNotificationService $notificationService
    ) {}

    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage, $storeId);
    }

    public function submit(array $data, int $storeId, string $userId): PromotionPaymentModel
    {
        return DB::transaction(function () use ($data, $storeId, $userId): PromotionPaymentModel {
            $model = new PromotionPaymentModel;
            $model->fill([
                'store_id' => $storeId,
                'user_id' => $userId,
                'payment_number' => $this->paymentNumber(),
                'package_name' => trim((string) $data['package_name']),
                'amount' => (float) $data['amount'],
                'payment_method' => $data['payment_method'] ?? null,
                'proof_url' => $data['proof_url'] ?? null,
                'status' => 'pending',
                'paid_at' => $data['paid_at'] ?? now(),
                'is_active' => true,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            $saved = $this->repository->save($model);
            $this->notificationService->notifyAdmins([
                'module' => 'promotion_payments',
                'type' => 'promotion.payment.submitted',
                'title' => 'Pembayaran promosi baru',
                'message' => $saved->payment_number.' · '.$saved->package_name,
                'reference_type' => 'promotion_payment',
                'reference_id' => $saved->id,
                'url' => '/admin/promotion-payments?payment='.$saved->id,
                'meta' => ['amount' => (float) $saved->amount, 'status' => $saved->status],
            ], $userId, $storeId);

            return $saved;
        });
    }

    public function review(int $id, string $status, ?string $reason, string $adminId): PromotionPaymentModel
    {
        if (! in_array($status, ['approved', 'rejected'], true)) {
            throw new InvalidArgumentException('Status pembayaran tidak valid.');
        }

        return DB::transaction(function () use ($id, $status, $reason, $adminId): PromotionPaymentModel {
            $model = $this->repository->find($id);

            if (! $model) {
                throw new InvalidArgumentException('Pembayaran promosi tidak ditemukan.');
            }

            if ($model->status === 'approved' && $model->promotion) {
                throw new InvalidArgumentException('Pembayaran sudah dipakai oleh promosi dan tidak dapat diubah.');
            }

            if ($status === 'rejected' && trim((string) $reason) === '') {
                throw new InvalidArgumentException('Alasan penolakan wajib diisi.');
            }

            $model->forceFill([
                'status' => $status,
                'rejection_reason' => $status === 'rejected' ? trim((string) $reason) : null,
                'reviewed_at' => now(),
                'reviewed_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            return $this->repository->save($model);
        });
    }

    public function approvedForPromotion(int $id, int $storeId, ?int $promotionId = null): PromotionPaymentModel
    {
        $payment = $this->repository->approvedAvailable($id, $storeId, $promotionId);

        if (! $payment) {
            throw new InvalidArgumentException('Pembayaran promosi belum disetujui, bukan milik toko Anda, atau sudah digunakan.');
        }

        return $payment;
    }

    private function paymentNumber(): string
    {
        do {
            $number = 'PRPAY-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5));
        } while (PromotionPaymentModel::query()->where('payment_number', $number)->exists());

        return $number;
    }
}
