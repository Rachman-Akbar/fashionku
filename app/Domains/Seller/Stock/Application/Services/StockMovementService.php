<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stock\Application\Services;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialStockMovementModel;
use App\Domains\Seller\Stock\Domain\Repositories\StockMovementRepositoryInterface;
use App\Domains\Seller\Stock\Infrastructure\Persistence\Models\StockMovementModel;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class StockMovementService
{
    private const DIMENSION_COLUMNS = [
        'available' => 'stock',
        'reserved' => 'stock_reserved',
        'booked' => 'stock_booked',
        'preorder' => 'stock_preorder',
    ];

    public function __construct(private StockMovementRepositoryInterface $repository,
        private CodePatternService $codePatterns) {}

    public function paginate(array $filters, int $perPage, ?int $storeId): LengthAwarePaginator
    {
        return $this->repository->paginate($filters, $perPage, $storeId);
    }

    public function adjust(array $data, ?int $sellerStoreId): StockMovementModel
    {
        return DB::transaction(function () use ($data, $sellerStoreId): StockMovementModel {
            $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $data['variant_id']);

            if (! $variant) {
                throw new InvalidArgumentException('Varian produk tidak ditemukan.');
            }

            $storeId = $sellerStoreId ?? (int) $variant->store_id;

            if ((int) $variant->store_id !== $storeId) {
                throw new InvalidArgumentException('Stok varian bukan milik toko Anda.');
            }

            $delta = (int) $data['quantity_delta'];
            $nextBalance = (int) $variant->stock + $delta;

            if ($delta === 0) {
                throw new InvalidArgumentException('Perubahan stok tidak boleh nol.');
            }

            if ($nextBalance < 0) {
                throw new InvalidArgumentException('Stok tidak mencukupi untuk pengurangan tersebut.');
            }

            $referenceType = (string) ($data['reference_type'] ?? 'manual');
            $providedReferenceId = strtoupper(trim((string) ($data['reference_id'] ?? '')));
            $occurredAt = $data['occurred_at'] ?? now();
            $requestedType = strtolower(trim((string) ($data['movement_type'] ?? '')));
            $allowedTypes = ['inbound', 'outbound', 'adjustment', 'release', 'reservation', 'production'];

            if ($requestedType !== '' && ! in_array($requestedType, $allowedTypes, true)) {
                throw new InvalidArgumentException('Tipe pergerakan stok tidak valid.');
            }

            $movementType = $requestedType !== ''
                ? $requestedType
                : ($delta > 0 ? 'inbound' : 'outbound');

            $referenceId = $providedReferenceId !== ''
                ? $providedReferenceId
                : $this->generateMovementReference($storeId, $movementType);

            if ($delta > 0 && $movementType !== 'release') {
                $this->consumeRawMaterialsForProduction(
                    productId: (int) $variant->product_id,
                    storeId: $storeId,
                    producedQuantity: $delta,
                    referenceType: $referenceType,
                    referenceId: $referenceId,
                    occurredAt: $occurredAt
                );
            }

            $variant->forceFill(['stock' => $nextBalance])->save();

            return $this->repository->save(new StockMovementModel([
                'store_id' => $storeId,
                'product_id' => $variant->product_id,
                'variant_id' => $variant->id,
                'type' => $movementType,
                'quantity_delta' => $delta,
                'balance_after' => $nextBalance,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'notes' => $data['notes'] ?? null,
                'occurred_at' => $occurredAt,
            ]));
        });
    }

    public function reserveCheckout(int $orderId): void
    {
        foreach ($this->loadOrderItems($orderId, null) as $item) {
            foreach ($this->resolveReservationDimensions($item) as $dimension) {
                $movementKey = 'checkout-reserved.'.$dimension;

                if ($this->repository->existsForOrderItem((int) $item->order_item_id, $movementKey)) {
                    continue;
                }

                $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $item->variant_id);
                if (! $variant) {
                    continue;
                }

                $column = self::DIMENSION_COLUMNS[$dimension];
                $nextBalance = (int) $variant->{$column} + (int) $item->quantity;
                $variant->forceFill([$column => $nextBalance])->save();

                $this->saveItemMovement(
                    $orderId,
                    $item,
                    $movementKey,
                    'reservation',
                    -1 * (int) $item->quantity,
                    $nextBalance,
                    $dimension,
                    'checkout',
                    'Reservasi stok saat checkout',
                    (string) $orderId
                );
            }
        }
    }

    public function commitCheckout(int $orderId): void
    {
        $this->commitOrderItems($orderId, null);
    }

    public function syncOrderStatus(int $orderId, string $previousStatus, string $nextStatus): void
    {
        if ($previousStatus === $nextStatus) {
            return;
        }

        if ($nextStatus === 'cancelled') {
            $this->releaseOrderItems($orderId, null);

            return;
        }

        if (! in_array($nextStatus, ['processing', 'shipped', 'received', 'completed'], true)) {
            return;
        }

        $this->applyStatusTransition($orderId, null, $nextStatus);
    }

    public function syncSubOrderStatus(int $subOrderId, string $previousStatus, string $nextStatus): void
    {
        if ($previousStatus === $nextStatus) {
            return;
        }

        if ($nextStatus === 'cancelled') {
            $this->releaseOrderItems(null, $subOrderId);

            return;
        }

        if (! in_array($nextStatus, ['processing', 'shipped', 'received', 'completed'], true)) {
            return;
        }

        $this->applyStatusTransition(null, $subOrderId, $nextStatus);
    }

    /**
     * Sesuaikan stok (available/reserved) setelah qty order manual diubah.
     *
     * @param  array<int, array{order_item_id: int, quantity: int}>  $items
     */
    public function reconcileSubOrderItems(int $subOrderId, array $items): void
    {
        if ($items === []) {
            return;
        }

        $keyed = collect($items)->keyBy('order_item_id');
        $current = $this->loadOrderItems(null, $subOrderId);

        DB::transaction(function () use ($subOrderId, $keyed, $current): void {
            foreach ($current as $item) {
                $target = $keyed->get((int) $item->order_item_id);

                if (! $target) {
                    throw new InvalidArgumentException('Item pesanan yang dikirim tidak lengkap.');
                }

                $oldQty = (int) $item->quantity;
                $newQty = (int) $target['quantity'];
                $delta = $newQty - $oldQty;

                if ($delta === 0) {
                    continue;
                }

                $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $item->variant_id);
                if (! $variant) {
                    continue;
                }

                $maxOrderQty = (int) $variant->max_order_qty;
                if ($maxOrderQty > 0 && $newQty > $maxOrderQty) {
                    throw new InvalidArgumentException('Jumlah pesanan melebihi batas order toko (maksimal '.$maxOrderQty.' unit).');
                }

                $committed = $this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.available')
                    || $this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.preorder');

                if ($committed) {
                    $available = max(0, (int) $variant->stock);
                    if ($delta > 0 && $delta > $available) {
                        throw new InvalidArgumentException('Stok tidak mencukupi untuk menambah jumlah pesanan.');
                    }

                    $nextBalance = (int) $variant->stock - $delta;
                    $variant->forceFill(['stock' => $nextBalance])->save();

                    $this->saveItemMovement(
                        (int) ($item->order_id ?? $subOrderId),
                        $item,
                        'manual-edit.available.'.substr((string) microtime(), 2, 6),
                        'outbound',
                        -1 * $delta,
                        $nextBalance,
                        'available',
                        'order_adjusted',
                        $delta > 0 ? 'Qty pesanan manual ditambah' : 'Qty pesanan manual dikurangi',
                        (string) $subOrderId
                    );

                    continue;
                }

                $available = max(0, (int) $variant->stock - (int) $variant->stock_reserved - (int) $variant->stock_booked);
                if ($delta > 0 && $delta > $available) {
                    throw new InvalidArgumentException('Stok tidak mencukupi. Tersedia '.$available.' unit.');
                }

                $nextReserved = (int) $variant->stock_reserved + $delta;
                $variant->forceFill(['stock_reserved' => $nextReserved])->save();

                $this->saveItemMovement(
                    (int) ($item->order_id ?? $subOrderId),
                    $item,
                    'manual-edit.reserved.'.substr((string) microtime(), 2, 6),
                    'adjust',
                    $delta,
                    $nextReserved,
                    'reserved',
                    'order_adjusted',
                    $delta > 0 ? 'Reservasi pesanan manual ditambah' : 'Reservasi pesanan manual dikurangi',
                    (string) $subOrderId
                );
            }
        });
    }

    private function generateMovementReference(int $storeId, string $movementType): string
    {
        $movement = match ($movementType) {
            'inbound' => 'MASUK',
            'outbound' => 'KELUAR',
            'production' => 'PRODUKSI',
            'release' => 'RILIS',
            'reservation' => 'RESERVASI',
            default => 'ADJ',
        };

        return $this->codePatterns->unique('stock_reference', $storeId, [
            'movement' => $movement,
            'type' => 'STK',
            'seq' => $this->codePatterns->sequenceFor('stock_movements', 'occurred_at', $storeId),
        ], fn (string $reference): bool => StockMovementModel::query()
            ->where('store_id', $storeId)
            ->where('reference_id', $reference)
            ->exists());
    }

    private function applyStatusTransition(?int $orderId, ?int $subOrderId, string $nextStatus): void
    {
        DB::transaction(function () use ($orderId, $subOrderId, $nextStatus): void {
            if ($nextStatus === 'processing') {
                $this->commitOrderItems($orderId, $subOrderId);
            }

            if ($nextStatus === 'completed') {
                $this->releasePreorderCommit($orderId, $subOrderId);
            }

            $keyPrefix = $subOrderId !== null ? 'sub-order' : 'order';
            $referenceType = $subOrderId !== null ? 'sub_order_status' : 'order_status';
            $referenceId = $subOrderId !== null ? (string) $subOrderId : (string) $orderId;

            foreach ($this->loadOrderItems($orderId, $subOrderId) as $item) {
                $movementKey = $keyPrefix.'-status-'.$nextStatus;

                if ($this->repository->existsForOrderItem((int) $item->order_item_id, $movementKey)) {
                    continue;
                }

                $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $item->variant_id);

                $this->saveItemMovement(
                    (int) ($item->order_id ?? $orderId),
                    $item,
                    $movementKey,
                    'status',
                    0,
                    (int) ($variant?->stock ?? 0),
                    'available',
                    $referenceType,
                    'Status pesanan berubah menjadi '.$nextStatus,
                    $referenceId
                );
            }
        });
    }

    private function commitOrderItems(?int $orderId, ?int $subOrderId): void
    {
        if (($orderId === null) === ($subOrderId === null)) {
            throw new InvalidArgumentException('commitOrderItems membutuhkan orderId atau subOrderId yang spesifik.');
        }

        foreach ($this->loadOrderItems($orderId, $subOrderId) as $item) {
            if ($this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.available')
                || $this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.preorder')) {
                continue;
            }

            $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $item->variant_id);
            if (! $variant) {
                continue;
            }

            $quantity = (int) $item->quantity;
            $orderIdValue = (int) ($item->order_id ?? $orderId);

            foreach (['reserved', 'booked', 'preorder'] as $dimension) {
                if (! $this->repository->existsForOrderItem((int) $item->order_item_id, 'checkout-reserved.'.$dimension)) {
                    continue;
                }

                if ($dimension === 'preorder') {
                    $this->saveItemMovement(
                        $orderIdValue,
                        $item,
                        'paid-commit.preorder',
                        'status',
                        0,
                        (int) $variant->stock_preorder,
                        'preorder',
                        'payment',
                        'Komitmen preorder dikonfirmasi, menunggu produksi',
                        (string) $orderIdValue
                    );

                    continue;
                }

                $column = self::DIMENSION_COLUMNS[$dimension];
                $nextBalance = (int) $variant->{$column} - $quantity;
                $variant->forceFill([$column => $nextBalance])->save();

                $this->saveItemMovement(
                    $orderIdValue,
                    $item,
                    'paid-commit.'.$dimension,
                    'outbound',
                    -1 * $quantity,
                    $nextBalance,
                    $dimension,
                    'payment',
                    'Komitmen '.$dimension.' dipotong saat pembayaran berhasil',
                    (string) $orderIdValue
                );
            }

            if ($this->repository->existsForOrderItem((int) $item->order_item_id, 'checkout-reserved.reserved')
                || $this->repository->existsForOrderItem((int) $item->order_item_id, 'checkout-reserved.booked')) {
                $nextStock = (int) $variant->stock - $quantity;
                $variant->forceFill(['stock' => $nextStock])->save();

                $this->saveItemMovement(
                    $orderIdValue,
                    $item,
                    'paid-commit.available',
                    'outbound',
                    -1 * $quantity,
                    $nextStock,
                    'available',
                    'payment',
                    'Stok terpotong saat pembayaran berhasil',
                    (string) $orderIdValue
                );
            }
        }
    }

    private function releasePreorderCommit(?int $orderId, ?int $subOrderId): void
    {
        foreach ($this->loadOrderItems($orderId, $subOrderId) as $item) {
            if (! $this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.preorder')) {
                continue;
            }

            if ($this->repository->existsForOrderItem((int) $item->order_item_id, 'preorder-fulfilled')) {
                continue;
            }

            $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $item->variant_id);
            if (! $variant) {
                continue;
            }

            $quantity = (int) $item->quantity;
            $nextBalance = (int) $variant->stock_preorder - $quantity;
            $variant->forceFill(['stock_preorder' => $nextBalance])->save();

            $this->saveItemMovement(
                (int) ($item->order_id ?? $orderId),
                $item,
                'preorder-fulfilled',
                'outbound',
                -1 * $quantity,
                $nextBalance,
                'preorder',
                'order_completed',
                'Komitmen preorder terpenuhi',
                (string) ($item->order_id ?? $orderId)
            );
        }
    }

    private function releaseOrderItems(?int $orderId, ?int $subOrderId): void
    {
        foreach ($this->loadOrderItems($orderId, $subOrderId) as $item) {
            $variant = ProductVariantModel::query()->lockForUpdate()->find((int) $item->variant_id);
            if (! $variant) {
                continue;
            }

            $quantity = (int) $item->quantity;
            $orderIdValue = (int) ($item->order_id ?? $orderId);
            $committed = $this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.available')
                || $this->repository->existsForOrderItem((int) $item->order_item_id, 'paid-commit.preorder');

            if ($committed) {
                $physical = $this->repository->existsForOrderItem((int) $item->order_item_id, 'checkout-reserved.reserved')
                    || $this->repository->existsForOrderItem((int) $item->order_item_id, 'checkout-reserved.booked');

                if ($physical) {
                    $nextBalance = (int) $variant->stock + $quantity;
                    $variant->forceFill(['stock' => $nextBalance])->save();

                    $this->saveItemMovement(
                        $orderIdValue,
                        $item,
                        'cancel-release.available',
                        'release',
                        $quantity,
                        $nextBalance,
                        'available',
                        'order_cancelled',
                        'Stok dikembalikan karena pesanan dibatalkan',
                        (string) $orderIdValue
                    );
                } else {
                    $this->saveItemMovement(
                        $orderIdValue,
                        $item,
                        'cancel-release.preorder',
                        'status',
                        0,
                        (int) $variant->stock_preorder,
                        'preorder',
                        'order_cancelled',
                        'Komitmen preorder dibatalkan',
                        (string) $orderIdValue
                    );
                }

                continue;
            }

            foreach (['reserved', 'booked', 'preorder'] as $dimension) {
                if (! $this->repository->existsForOrderItem((int) $item->order_item_id, 'checkout-reserved.'.$dimension)) {
                    continue;
                }

                $column = self::DIMENSION_COLUMNS[$dimension];
                $nextBalance = (int) $variant->{$column} - $quantity;
                $variant->forceFill([$column => $nextBalance])->save();

                $this->saveItemMovement(
                    $orderIdValue,
                    $item,
                    'cancel-release.'.$dimension,
                    'release',
                    -1 * $quantity,
                    $nextBalance,
                    $dimension,
                    'order_cancelled',
                    'Komitmen '.$dimension.' dilepas karena pesanan dibatalkan',
                    (string) $orderIdValue
                );
            }
        }
    }

    private function loadOrderItems(?int $orderId, ?int $subOrderId): Collection
    {
        if (($orderId === null) === ($subOrderId === null)) {
            throw new InvalidArgumentException('loadOrderItems membutuhkan orderId atau subOrderId yang spesifik.');
        }

        $query = DB::table('order_items')
            ->join('sub_orders', 'sub_orders.id', '=', 'order_items.sub_order_id')
            ->join('orders', 'orders.id', '=', 'sub_orders.order_id')
            ->join('product_variants', 'product_variants.id', '=', 'order_items.variant_id')
            ->join('products', 'products.id', '=', 'product_variants.product_id')
            ->whereNotNull('order_items.variant_id')
            ->select([
                'order_items.id as order_item_id',
                'order_items.product_id',
                'order_items.variant_id',
                'order_items.quantity',
                'sub_orders.id as sub_order_id',
                'sub_orders.order_id',
                'sub_orders.store_id',
                'orders.order_type',
                'product_variants.stock',
                'product_variants.stock_reserved',
                'product_variants.stock_booked',
                'product_variants.stock_preorder',
                'product_variants.max_order_qty',
                'products.allows_preorder',
            ]);

        if ($orderId !== null) {
            $query->where('sub_orders.order_id', $orderId);
        } else {
            $query->where('sub_orders.id', $subOrderId);
        }

        return $query->get();
    }

    private function resolveReservationDimensions(object $item): array
    {
        $quantity = (int) $item->quantity;
        $maxOrderQty = (int) $item->max_order_qty;

        if ($maxOrderQty > 0 && $quantity > $maxOrderQty) {
            throw new InvalidArgumentException('Jumlah pesanan melebihi batas order toko (maksimal '.$maxOrderQty.' unit).');
        }

        $available = max(0, (int) $item->stock - (int) $item->stock_reserved - (int) $item->stock_booked);

        if ($quantity <= $available) {
            return $item->order_type === 'booking' ? ['reserved', 'booked'] : ['reserved'];
        }

        if ((int) $item->stock === 0) {
            if ((bool) $item->allows_preorder) {
                return ['preorder'];
            }

            throw new InvalidArgumentException('Stok varian habis dan preorder untuk produk ini tidak tersedia.');
        }

        throw new InvalidArgumentException('Stok tidak mencukupi. Tersedia '.$available.' unit.');
    }

    private function saveItemMovement(
        int $orderId,
        object $item,
        string $movementKey,
        string $type,
        int $delta,
        int $balanceAfter,
        string $dimension,
        string $referenceType,
        string $notes,
        ?string $referenceId = null
    ): void {
        $this->repository->save(new StockMovementModel([
            'store_id' => (int) $item->store_id,
            'product_id' => (int) $item->product_id,
            'variant_id' => (int) $item->variant_id,
            'order_id' => $orderId,
            'order_item_id' => (int) $item->order_item_id,
            'movement_key' => $movementKey,
            'type' => $type,
            'quantity_delta' => $delta,
            'balance_after' => $balanceAfter,
            'stock_dimension' => $dimension,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
            'occurred_at' => now(),
        ]));
    }

    private function consumeRawMaterialsForProduction(int $productId, int $storeId, int $producedQuantity, string $referenceType, mixed $referenceId, mixed $occurredAt): void
    {
        $product = DB::table('products')->where('id', $productId)->where('store_id', $storeId)->lockForUpdate()->first();
        if (! $product) {
            throw new InvalidArgumentException('Produk untuk pembentukan stok tidak ditemukan.');
        }

        $recipe = DB::table('product_materials as pm')
            ->join('raw_materials as rm', 'rm.id', '=', 'pm.raw_material_id')
            ->where('pm.product_id', $productId)
            ->where('rm.store_id', $storeId)
            ->select('pm.raw_material_id', 'pm.quantity', 'rm.code', 'rm.name', 'rm.is_active', 'rm.deleted_at')
            ->orderBy('pm.raw_material_id')
            ->get();

        if ($recipe->isEmpty()) {
            return;
        }

        $lockedMaterials = [];
        foreach ($recipe as $row) {
            if ($row->deleted_at !== null || ! (bool) $row->is_active) {
                throw new InvalidArgumentException('Bahan baku '.$row->code.' - '.$row->name.' pada resep produk sudah nonaktif atau dihapus. Perbarui HPP sebelum menambah stok produk.');
            }

            $material = RawMaterialModel::query()->where('store_id', $storeId)->lockForUpdate()->find((int) $row->raw_material_id);
            if (! $material) {
                throw new InvalidArgumentException('Bahan baku untuk pembentukan produk tidak ditemukan.');
            }

            $required = (float) $row->quantity * $producedQuantity;
            if ((float) $material->stock + 0.0000001 < $required) {
                throw new InvalidArgumentException('Stok bahan baku '.$material->code.' - '.$material->name.' tidak mencukupi. Dibutuhkan '.rtrim(rtrim(number_format($required, 4, '.', ''), '0'), '.').' '.$material->unit.'.');
            }
            $lockedMaterials[] = [$material, $required];
        }

        $productionReference = $referenceId ?: 'PROD-'.$productId.'-'.Str::upper(Str::random(8));
        foreach ($lockedMaterials as [$material, $required]) {
            $nextBalance = (float) $material->stock - $required;
            $material->forceFill(['stock' => $nextBalance])->save();
            RawMaterialStockMovementModel::query()->create([
                'store_id' => $storeId,
                'raw_material_id' => $material->id,
                'type' => 'production_usage',
                'quantity_delta' => -1 * $required,
                'balance_after' => $nextBalance,
                'unit_cost' => (float) $material->average_cost,
                'total_cost' => $required * (float) $material->average_cost,
                'reference_type' => 'product_production',
                'reference_number' => (string) $productionReference,
                'notes' => 'Pemakaian otomatis untuk penambahan stok produk dari '.$referenceType,
                'occurred_at' => $occurredAt,
            ]);
        }
    }
}
