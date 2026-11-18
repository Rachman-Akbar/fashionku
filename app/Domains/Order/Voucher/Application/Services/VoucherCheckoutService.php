<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\Services;

use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Satu-satunya tempat syarat voucher dievaluasi saat checkout.
 *
 * Semua syarat dibaca langsung dari database (`vouchers` + `voucher_products`),
 * bukan dari payload client, sehingga frontend hanya menampilkan hasil preview
 * dan tidak pernah menentukan kelayakan voucher sendiri.
 */
final class VoucherCheckoutService
{
    /**
     * @param  array<int, array{product_id?: int, price?: float|int, quantity?: int}>  $items
     * @return array{voucher_id: int, discount: float, shipping_discount: float, voucher: object}
     */
    public function evaluate(
        string $userId,
        ?string $voucherCode,
        float $itemsTotal,
        float $shippingTotal,
        array $items
    ): array {
        $code = strtolower(trim((string) $voucherCode));

        if ($code === '') {
            return ['voucher_id' => 0, 'discount' => 0.0, 'shipping_discount' => 0.0, 'voucher' => null];
        }

        $voucher = DB::table('vouchers')
            ->where('code', $code)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->lockForUpdate()
            ->first();

        if (! $voucher) {
            throw new RuntimeException('Voucher tidak dikenali.');
        }

        // --- Tanggal berlaku (dikontrol oleh database) ---
        if (now()->lt($voucher->starts_at) || now()->gt($voucher->ends_at)) {
            throw new RuntimeException('Voucher sudah kedaluwarsa atau belum berlaku.');
        }

        // --- Kuota global ---
        if ((int) $voucher->usage_limit > 0 && (int) $voucher->used_count >= (int) $voucher->usage_limit) {
            throw new RuntimeException('Kuota penggunaan voucher sudah habis.');
        }

        // --- Kuota per user (dikontrol oleh database) ---
        $usageLimitPerUser = (int) ($voucher->usage_limit_per_user ?? 0);
        if ($usageLimitPerUser > 0) {
            $usedByUser = (int) DB::table('orders')
                ->where('user_id', $userId)
                ->where('voucher_id', $voucher->id)
                ->where('status', '!=', 'cancelled')
                ->count();

            if ($usedByUser >= $usageLimitPerUser) {
                throw new RuntimeException(
                    "Voucher ini sudah digunakan maksimal {$usageLimitPerUser} kali oleh akun Anda."
                );
            }
        }

        // --- Scope produk: voucher bersyarat hanya dihitung dari produknya ---
        $voucherProductIds = DB::table('voucher_products')
            ->where('voucher_id', $voucher->id)
            ->pluck('product_id')
            ->map(fn (mixed $id): int => (int) $id)
            ->all();

        $eligibleItems = $items;

        if ($voucherProductIds !== []) {
            $allowed = array_flip($voucherProductIds);
            $eligibleItems = array_values(array_filter(
                $items,
                fn (array $item): bool => isset($allowed[(int) ($item['product_id'] ?? 0)])
            ));

            if ($eligibleItems === []) {
                throw new RuntimeException('Voucher ini hanya berlaku untuk produk tertentu yang tidak ada di pesanan Anda.');
            }
        }

        $eligibleSubtotal = 0.0;
        foreach ($eligibleItems as $item) {
            $eligibleSubtotal += (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 0);
        }
        $eligibleShipping = $shippingTotal;

        if ($eligibleSubtotal < (float) $voucher->min_spend) {
            throw new RuntimeException('Minimal belanja voucher belum terpenuhi.');
        }

        // --- Syarat item (hanya item yang masuk scope) ---
        $totalItems = 0;
        $products = [];
        foreach ($eligibleItems as $item) {
            $totalItems += (int) ($item['quantity'] ?? 0);
            $products[(int) ($item['product_id'] ?? 0)] = true;
        }
        $distinctProducts = count($products);

        if ((int) $voucher->min_items > 0 && $totalItems < (int) $voucher->min_items) {
            throw new RuntimeException("Voucher membutuhkan minimal {$voucher->min_items} item dalam pesanan.");
        }

        if ((int) $voucher->min_distinct_products > 0 && $distinctProducts < (int) $voucher->min_distinct_products) {
            throw new RuntimeException("Voucher hanya berlaku untuk minimal {$voucher->min_distinct_products} item produk berbeda.");
        }

        $target = strtolower((string) $voucher->discount_target);
        $type = strtolower((string) $voucher->discount_type);
        $value = (float) $voucher->discount_value;
        $baseAmount = $target === 'shipping' ? $eligibleShipping : $eligibleSubtotal;

        if (! in_array($target, ['product', 'shipping'], true) || ! in_array($type, ['fixed', 'percentage'], true)) {
            throw new RuntimeException('Konfigurasi diskon voucher tidak didukung.');
        }

        $discount = $type === 'percentage' ? $baseAmount * $value / 100 : $value;

        if ($voucher->max_discount !== null && $voucher->max_discount !== '') {
            $discount = min($discount, (float) $voucher->max_discount);
        }

        $discount = min($baseAmount, max(0.0, $discount));

        return [
            'voucher_id' => (int) $voucher->id,
            'discount' => $target === 'product' ? $discount : 0.0,
            'shipping_discount' => $target === 'shipping' ? $discount : 0.0,
            'voucher' => $voucher,
        ];
    }

    /**
     * Preview untuk frontend: hasilkan kelayakan + nominal tanpa melempar error,
     * supaya UI bisa menampilkan alasan penolakan dari backend.
     *
     * @param  array<int, array{product_id?: int, price?: float|int, quantity?: int}>  $items
     * @return array{valid: bool, reason: string, product_discount: float, shipping_discount: float, eligible_subtotal: float, voucher: ?object}
     */
    public function preview(
        string $userId,
        ?string $voucherCode,
        float $itemsTotal,
        float $shippingTotal,
        array $items
    ): array {
        $code = strtolower(trim((string) $voucherCode));
        $voucherId = $code === ''
            ? null
            : DB::table('vouchers')->where('code', $code)->value('id');

        $scopedIds = $voucherId
            ? DB::table('voucher_products')
                ->where('voucher_id', (int) $voucherId)
                ->pluck('product_id')
                ->map(fn (mixed $id): int => (int) $id)
                ->all()
            : [];

        $subtotal = 0.0;
        foreach ($items as $item) {
            if ($scopedIds !== [] && ! in_array((int) ($item['product_id'] ?? 0), $scopedIds, true)) {
                continue;
            }

            $subtotal += (float) ($item['price'] ?? 0) * (int) ($item['quantity'] ?? 0);
        }

        try {
            $result = $this->evaluate($userId, $voucherCode, $itemsTotal, $shippingTotal, $items);
        } catch (RuntimeException $exception) {
            return [
                'valid' => false,
                'reason' => $exception->getMessage(),
                'product_discount' => 0.0,
                'shipping_discount' => 0.0,
                'eligible_subtotal' => $subtotal,
                'voucher' => null,
            ];
        }

        return [
            'valid' => true,
            'reason' => '',
            'product_discount' => $result['discount'],
            'shipping_discount' => $result['shipping_discount'],
            'eligible_subtotal' => $subtotal,
            'voucher' => $result['voucher'],
        ];
    }
}
