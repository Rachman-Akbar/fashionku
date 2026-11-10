<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\UseCases;

use App\Domains\Order\Voucher\Application\DTOs\VoucherDTO;
use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Order\Voucher\Domain\Repositories\VoucherRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;

final class ManageVoucherUseCase
{
    public function __construct(private VoucherRepositoryInterface $voucherRepository) {}

    public function listVouchers(array $filters = []): Collection
    {
        return $this->voucherRepository->getAll($filters);
    }

    public function showVoucher(int $id, bool $includeInactive = true): Voucher
    {
        $voucher = $this->voucherRepository->findById($id, $includeInactive);

        if (! $voucher) {
            throw new ModelNotFoundException('Voucher tidak ditemukan.');
        }

        return $voucher;
    }

    public function createVoucher(VoucherDTO $dto): Voucher
    {
        $this->assertUnique($dto);

        return $this->voucherRepository->save(new Voucher([
            'store_id' => $dto->store_id,
            'voucher_scope' => $dto->voucher_scope,
            'code' => $dto->code,
            'name' => $dto->name,
            'image' => $dto->image,
            'discount_target' => $dto->discount_target,
            'discount_type' => $dto->discount_type,
            'discount_value' => $dto->discount_value,
            'min_spend' => $dto->min_spend,
            'min_items' => $dto->min_items,
            'min_distinct_products' => $dto->min_distinct_products,
            'terms' => $dto->terms,
            'max_discount' => $dto->max_discount,
            'starts_at' => $dto->starts_at,
            'ends_at' => $dto->ends_at,
            'usage_limit' => $dto->usage_limit,
            'used_count' => 0,
            'is_active' => $dto->is_active,
        ]));
    }

    public function updateVoucher(int $id, VoucherDTO $dto): Voucher
    {
        $voucher = $this->showVoucher($id, true);
        $this->assertUnique($dto, $id);
        $voucher->fill([
            'store_id' => $dto->store_id,
            'voucher_scope' => $dto->voucher_scope,
            'code' => $dto->code,
            'name' => $dto->name,
            'image' => $dto->image ?? $voucher->image,
            'discount_target' => $dto->discount_target,
            'discount_type' => $dto->discount_type,
            'discount_value' => $dto->discount_value,
            'min_spend' => $dto->min_spend,
            'min_items' => $dto->min_items,
            'min_distinct_products' => $dto->min_distinct_products,
            'terms' => $dto->terms,
            'max_discount' => $dto->max_discount,
            'starts_at' => $dto->starts_at,
            'ends_at' => $dto->ends_at,
            'usage_limit' => $dto->usage_limit,
            'is_active' => $dto->is_active,
        ]);

        return $this->voucherRepository->save($voucher);
    }

    public function deleteVoucher(int $id): bool
    {
        return $this->voucherRepository->delete($this->showVoucher($id, true));
    }

    private function assertUnique(VoucherDTO $dto, ?int $ignoreId = null): void
    {
        if ($this->voucherRepository->codeExists($dto->code, $ignoreId)) {
            throw new Exception("Kode voucher '{$dto->code}' sudah digunakan.");
        }

        if ($this->voucherRepository->nameExists($dto->name, $ignoreId)) {
            throw new Exception("Nama voucher '{$dto->name}' sudah digunakan.");
        }
    }
}
