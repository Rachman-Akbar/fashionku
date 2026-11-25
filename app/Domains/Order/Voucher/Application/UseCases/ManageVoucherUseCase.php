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

        $voucher = $this->voucherRepository->save(new Voucher([
            'code' => $dto->code,
            'name' => $dto->name,
            'image' => $dto->image,
            'discount_target' => $dto->discount_target,
            'discount_type' => $dto->discount_type,
            'discount_value' => $dto->discount_value,
            'min_spend' => $dto->min_spend,
            'min_items' => $dto->min_items,
            'min_distinct_products' => $dto->min_distinct_products,
            'min_same_product_qty' => $dto->min_same_product_qty,
            'terms' => $dto->terms,
            'max_discount' => $dto->max_discount,
            'starts_at' => $dto->starts_at,
            'ends_at' => $dto->ends_at,
            'usage_limit' => $dto->usage_limit,
            'usage_limit_per_user' => $dto->usage_limit_per_user,
            'used_count' => 0,
            'is_active' => $dto->is_active,
        ]));

        $this->syncProducts($voucher, $dto->product_ids);

        return $voucher->fresh('voucherProducts');
    }

    public function updateVoucher(int $id, VoucherDTO $dto): Voucher
    {
        $voucher = $this->showVoucher($id, true);
        $this->assertUnique($dto, $id);
        $voucher->fill([
            'code' => $dto->code,
            'name' => $dto->name,
            'image' => $dto->image ?? $voucher->image,
            'discount_target' => $dto->discount_target,
            'discount_type' => $dto->discount_type,
            'discount_value' => $dto->discount_value,
            'min_spend' => $dto->min_spend,
            'min_items' => $dto->min_items,
            'min_distinct_products' => $dto->min_distinct_products,
            'min_same_product_qty' => $dto->min_same_product_qty,
            'terms' => $dto->terms,
            'max_discount' => $dto->max_discount,
            'starts_at' => $dto->starts_at,
            'ends_at' => $dto->ends_at,
            'usage_limit' => $dto->usage_limit,
            'usage_limit_per_user' => $dto->usage_limit_per_user,
            'is_active' => $dto->is_active,
        ]);

        $this->voucherRepository->save($voucher);
        $this->syncProducts($voucher, $dto->product_ids);

        return $voucher->fresh('voucherProducts');
    }

    /**
     * Sinkronkan produk yang menjadi syarat voucher. Array kosong berarti
     * voucher berlaku untuk semua produk (tidak ada batasan).
     *
     * @param  array<int, int>  $productIds
     */
    private function syncProducts(Voucher $voucher, array $productIds): void
    {
        $ids = collect($productIds)
            ->map(fn (mixed $id): int => (int) $id)
            ->filter(fn (int $id): bool => $id > 0)
            ->unique()
            ->values();

        $exists = $ids->isEmpty()
            ? []
            : \Illuminate\Support\Facades\DB::table('products')
                ->whereIn('id', $ids)
                ->pluck('id')
                ->map(fn (mixed $id): int => (int) $id)
                ->all();

        $voucher->voucherProducts()->sync($exists);
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
