<?php

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Admin\Notification\Application\Services\AdminNotificationService;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Domain\Entities\Order;
use App\Domains\Order\Ordering\Domain\Entities\OrderItem;
use App\Domains\Order\Ordering\Domain\Entities\SubOrder;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Ordering\Domain\Services\ShippingCostCalculator;
use App\Domains\Order\Payment\Domain\Entities\Payment;
use App\Domains\Order\Payment\Domain\Repositories\PaymentRepositoryInterface;
use App\Domains\Order\Payment\Infrastructure\Services\MidtransService;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateOrderUseCase
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private AddressRepositoryInterface $addressRepository,
        private ProductForCartReaderInterface $productReader,
        private GetShippingOptionsUseCase $shippingOptionsUseCase,
        private ShippingCostCalculator $shippingCalculator,
        private MidtransService $midtransService,
        private PaymentRepositoryInterface $paymentRepository,
        private StockMovementService $stockMovementService,
        private AdminNotificationService $notificationService
    ) {}

    public function execute(
        string $userId,
        ?int $addressId,
        array $cartItemIds,
        string $courier,
        ?string $service,
        string $paymentMethod,
        ?string $voucherCode = null,
        string $orderType = 'normal',
        ?string $preorderReleaseAt = null,
        ?string $scheduledAt = null,
        array $items = []
    ): Order {
        if (trim($userId) === '') {
            throw new RuntimeException('Sesi Anda telah berakhir. Silakan login kembali.');
        }

        $ids = collect($cartItemIds)->map(fn ($id) => (int) $id)->filter()->unique()->values();
        $directQuantities = [];
        foreach ($items as $line) {
            $variantId = (int) ($line['product_variant_id'] ?? 0);
            $quantity = (int) ($line['quantity'] ?? 0);

            if ($variantId > 0 && $quantity > 0) {
                $directQuantities[$variantId] = (int) ($directQuantities[$variantId] ?? 0) + $quantity;
            }
        }

        if ($ids->isEmpty() && $directQuantities === []) {
            throw new RuntimeException('Pilih minimal satu produk untuk melakukan checkout.');
        }

        $cart = null;
        $groups = [];
        $itemsTotal = 0.0;

        if ($ids->isNotEmpty()) {
            $cart = CartModel::where('user_id', $userId)->first();
            if (! $cart) {
                throw new RuntimeException('Keranjang belanja tidak ditemukan.');
            }

            $selectedItems = $cart->items()->whereIn('id', $ids)->get();
            if ($selectedItems->count() !== $ids->count()) {
                throw new RuntimeException('Sebagian item checkout tidak ditemukan di keranjang Anda.');
            }

            $variantIds = $selectedItems->pluck('product_variant_id')->map(fn ($id) => (int) $id)->all();
            $detailsMap = $this->productReader->getVariantsDetails($variantIds);

            foreach ($selectedItems as $cartItem) {
                $details = $detailsMap[(int) $cartItem->product_variant_id] ?? null;
                if (! $details) {
                    throw new RuntimeException('Data varian produk tidak ditemukan.');
                }

                $lineTotal = $details->getPrice()->getAmount() * (int) $cartItem->quantity;
                $itemsTotal += $lineTotal;
                $groups[$details->getStoreId()][] = [
                    'cart_item_id' => (int) $cartItem->id,
                    'variant_id' => $details->getId(),
                    'product_id' => $details->getProductId(),
                    'store_id' => $details->getStoreId(),
                    'store_name' => $details->getStoreName(),
                    'product_name' => $details->getProductName(),
                    'variant_name' => $details->getName(),
                    'sku' => $details->getSku(),
                    'thumbnail' => $details->getThumbnail(),
                    'price' => $details->getPrice()->getAmount(),
                    'quantity' => (int) $cartItem->quantity,
                ];
            }
        } else {
            $variantIds = array_keys($directQuantities);
            $detailsMap = $this->productReader->getVariantsDetails($variantIds);

            if (count($detailsMap) !== count($variantIds)) {
                throw new RuntimeException('Beberapa produk tidak tersedia untuk dibeli.');
            }

            foreach ($directQuantities as $variantId => $quantity) {
                $details = $detailsMap[(int) $variantId] ?? null;
                if (! $details) {
                    throw new RuntimeException('Data varian produk tidak ditemukan.');
                }

                $itemsTotal += $details->getPrice()->getAmount() * $quantity;
                $groups[$details->getStoreId()][] = [
                    'variant_id' => $details->getId(),
                    'product_id' => $details->getProductId(),
                    'store_id' => $details->getStoreId(),
                    'store_name' => $details->getStoreName(),
                    'product_name' => $details->getProductName(),
                    'variant_name' => $details->getName(),
                    'sku' => $details->getSku(),
                    'thumbnail' => $details->getThumbnail(),
                    'price' => $details->getPrice()->getAmount(),
                    'quantity' => $quantity,
                ];
            }
        }

        $courier = $this->shippingCalculator->normalizeCourier($courier);
        $service = $service ? strtoupper(trim($service)) : null;
        if ($courier === 'haversine' && in_array($service, [null, 'INTERNAL', 'EXPRESS', 'LOCAL'], true)) {
            $service = 'HAVERSINE';
        }
        $paymentMethod = strtolower(trim($paymentMethod));
        $orderType = strtolower(trim($orderType));

        if (! in_array($orderType, ['normal', 'preorder', 'booking'], true)) {
            throw new RuntimeException('Tipe pesanan tidak valid.');
        }

        if ($paymentMethod === 'tunai_toko' && $courier !== 'ambil_sendiri') {
            throw new RuntimeException('Bayar tunai di toko hanya tersedia untuk metode ambil sendiri.');
        }
        if ($paymentMethod === 'cod' && $courier === 'ambil_sendiri') {
            throw new RuntimeException('COD tidak tersedia untuk metode ambil sendiri.');
        }
        $shippingBreakdown = [];
        $shippingTotal = 0.0;
        $shippingAddress = 'Ambil sendiri di toko';
        $destinationId = 'STORE-PICKUP';

        if ($courier === 'ambil_sendiri') {
            foreach (array_keys($groups) as $storeId) {
                $shippingBreakdown[$storeId] = 0.0;
            }
            $service = 'PICKUP';
        } else {
            if (! $addressId) {
                throw new RuntimeException('Alamat pengiriman wajib ditentukan.');
            }

            $address = $this->addressRepository->findByIdAndOwner($addressId, $userId, null);
            if (! $address) {
                throw new RuntimeException('Alamat pengiriman tidak ditemukan.');
            }

            $shippingAddress = json_encode([
                'recipient' => $address->recipient_name,
                'phone' => $address->phone_number,
                'address' => collect([
                    $address->full_address,
                    $address->subdistrict,
                    $address->district,
                    $address->city_or_regency,
                    $address->province,
                    $address->postal_code,
                ])->filter()->implode(', '),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $directQuoteItems = $ids->isEmpty()
            ? collect($directQuantities)
                ->map(fn (int $quantity, int $variantId): array => [
                    'product_variant_id' => $variantId,
                    'quantity' => $quantity,
                ])
                ->values()
                ->all()
            : null;
            $quote = $this->shippingOptionsUseCase->execute($userId, $addressId, $ids->all(), $directQuoteItems);
            $address->refresh();
            $destinationId = trim((string) $address->komerce_destination_id);
            $selectedOption = collect($quote['options'])->first(function (array $option) use ($courier, $service): bool {
                if ($this->shippingCalculator->normalizeCourier((string) $option['courier']) !== $courier) {
                    return false;
                }

                return ! $service || strtoupper((string) $option['service']) === $service;
            });

            if (! $selectedOption) {
                throw new RuntimeException('Layanan pengiriman yang dipilih sudah tidak tersedia. Silakan hitung ulang ongkir.');
            }

            $service = strtoupper((string) $selectedOption['service']);
            $shippingTotal = (float) $selectedOption['cost'];
            foreach ($selectedOption['store_breakdown'] as $breakdown) {
                $shippingBreakdown[(int) $breakdown['store_id']] = (float) $breakdown['cost'];
            }
        }

        $storeSubtotals = [];
        foreach ($groups as $storeId => $items) {
            $storeSubtotals[(int) $storeId] = array_reduce(
                $items,
                fn (float $total, array $item): float => $total + ((float) $item['price'] * (int) $item['quantity']),
                0.0
            );
        }

        $orderNumber = 'ORD-'.now()->format('YmdHis').'-'.strtoupper(bin2hex(random_bytes(3)));
        $customer = DB::table('users')->where('id', $userId)->first(['name', 'email']);

        return DB::transaction(function () use (
            $userId,
            $orderNumber,
            $itemsTotal,
            $shippingTotal,
            $shippingBreakdown,
            $storeSubtotals,
            $groups,
            $shippingAddress,
            $destinationId,
            $courier,
            $service,
            $paymentMethod,
            $voucherCode,
            $cart,
            $ids,
            $customer,
            $orderType,
            $preorderReleaseAt,
            $scheduledAt
        ): Order {
            $orderType = $this->resolveOrderType($orderType, $groups, $scheduledAt);

            [$voucherId, $discountAmount, $shippingDiscountAmount] = $this->calculateVoucher(
                $userId,
                $voucherCode,
                $itemsTotal,
                $shippingTotal,
                $groups,
                $storeSubtotals,
                $shippingBreakdown
            );

            $subOrders = [];
            foreach ($groups as $storeId => $items) {
                $domainItems = [];
                $storeItemsTotal = 0.0;

                foreach ($items as $item) {
                    $storeItemsTotal += $item['price'] * $item['quantity'];
                    $label = $item['variant_name'] && $item['variant_name'] !== $item['product_name']
                        ? $item['product_name'].' - '.$item['variant_name']
                        : $item['product_name'];

                    $domainItems[] = new OrderItem(
                        id: null,
                        productId: $item['product_id'],
                        variantId: $item['variant_id'],
                        storeId: (int) $storeId,
                        productName: $label,
                        sku: $item['sku'],
                        thumbnail: $item['thumbnail'],
                        price: (float) $item['price'],
                        quantity: (int) $item['quantity']
                    );
                }

                $subOrders[] = new SubOrder(
                    id: null,
                    storeId: (int) $storeId,
                    storeName: (string) $items[0]['store_name'],
                    subOrderNumber: $orderNumber.'-S'.$storeId,
                    totalItemsPrice: $storeItemsTotal,
                    shippingCost: (float) ($shippingBreakdown[$storeId] ?? 0),
                    courier: $courier,
                    service: $service,
                    destinationId: $destinationId,
                    status: 'pending',
                    trackingNumber: null,
                    items: $domainItems
                );
            }

            $grossAmount = max(0.0, $itemsTotal + $shippingTotal - $discountAmount - $shippingDiscountAmount);
            $snapToken = null;
            if ($paymentMethod === 'midtrans' && $grossAmount > 0) {
                $snapToken = $this->midtransService->createSnapToken([
                    'order_id' => $orderNumber,
                    'gross_amount' => (int) round($grossAmount),
                    'user_id' => $userId,
                    'customer_name' => (string) ($customer->name ?? 'Customer'),
                    'customer_email' => (string) ($customer->email ?? ''),
                ]);
            }

            $order = new Order(
                id: null,
                orderNumber: $orderNumber,
                orderType: $orderType,
                preorderReleaseAt: $orderType === 'preorder' ? $preorderReleaseAt : null,
                scheduledAt: $orderType === 'booking' ? $scheduledAt : null,
                receivedAt: null,
                userId: $userId,
                voucherId: $voucherId,
                totalAmount: $itemsTotal + $shippingTotal,
                discountAmount: $discountAmount,
                shippingDiscountAmount: $shippingDiscountAmount,
                status: $grossAmount <= 0 ? 'processing' : 'pending',
                paymentStatus: $grossAmount <= 0 ? 'paid' : 'unpaid',
                paymentMethod: $paymentMethod,
                snapToken: $snapToken,
                shippingAddress: $shippingAddress,
                subOrders: $subOrders
            );

            $created = $this->orderRepository->create($order);
            $this->stockMovementService->reserveCheckout((int) $created->id);

            if ($grossAmount <= 0) {
                $this->stockMovementService->commitCheckout((int) $created->id);
            }

            $this->paymentRepository->save(new Payment(
                id: null,
                orderNumber: $orderNumber,
                transactionId: null,
                paymentMethod: $paymentMethod,
                amount: $grossAmount,
                status: $grossAmount <= 0 ? 'success' : 'pending',
                payload: null
            ));

            if ($voucherId) {
                DB::table('vouchers')->where('id', $voucherId)->increment('used_count');
                $userVoucherId = DB::table('user_vouchers')
                    ->where('user_id', $userId)
                    ->where('voucher_id', $voucherId)
                    ->whereIn('status', ['available', 'claimed'])
                    ->orderBy('id')
                    ->value('id');

                if ($userVoucherId) {
                    DB::table('user_vouchers')->where('id', $userVoucherId)->update([
                        'status' => 'used',
                        'used_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            if ($cart && $ids->isNotEmpty()) {
                $cart->items()->whereIn('id', $ids)->delete();
            }
            $this->notificationService->notifyAdmins([
                'module' => 'orders',
                'type' => 'order.created',
                'title' => 'Pesanan baru',
                'message' => $orderNumber.' · Rp '.number_format($grossAmount, 0, ',', '.'),
                'reference_type' => 'order',
                'reference_id' => $created->id,
                'url' => '/admin/orders?order='.$created->id,
                'meta' => ['order_number' => $orderNumber, 'order_type' => $orderType, 'payment_method' => $paymentMethod],
            ], $userId);

            return $created;
        });
    }

    private function resolveOrderType(string $requestedType, array $groups, ?string $scheduledAt): string
    {
        $requestedType = in_array($requestedType, ['normal', 'preorder', 'booking'], true) ? $requestedType : 'normal';
        $needsPreorder = false;

        foreach ($groups as $items) {
            foreach ($items as $item) {
                $variant = DB::table('product_variants')
                    ->where('id', $item['variant_id'])
                    ->lockForUpdate()
                    ->first();

                if (! $variant) {
                    throw new RuntimeException("Data varian {$item['product_name']} tidak ditemukan.");
                }

                $maxOrderQty = (int) $variant->max_order_qty;
                if ($maxOrderQty > 0 && (int) $item['quantity'] > $maxOrderQty) {
                    throw new RuntimeException(
                        "Maksimal {$maxOrderQty} unit {$item['product_name']} per pesanan (batas order toko)."
                    );
                }

                $available = (int) $variant->stock - (int) $variant->stock_reserved - (int) $variant->stock_booked;
                $available = max(0, $available);
                $quantity = (int) $item['quantity'];

                if ($quantity <= $available) {
                    continue;
                }

                if ((int) $variant->stock === 0) {
                    $allowsPreorder = (bool) DB::table('products')
                        ->where('id', $item['product_id'])
                        ->value('allows_preorder');

                    if (! $allowsPreorder) {
                        throw new RuntimeException("Stok {$item['product_name']} habis dan preorder untuk produk ini tidak tersedia.");
                    }

                    $needsPreorder = true;

                    continue;
                }

                throw new RuntimeException(
                    "Stok {$item['product_name']} tidak mencukupi. Tersedia {$available} unit. Kurangi jumlah pesanan."
                );
            }
        }

        if ($needsPreorder) {
            return 'preorder';
        }

        if ($requestedType === 'booking') {
            if ($scheduledAt === null) {
                throw new RuntimeException('Jadwal kirim/pickup wajib diisi untuk pesanan booking.');
            }

            return 'booking';
        }

        return $requestedType === 'preorder' ? 'preorder' : 'normal';
    }

    private function calculateVoucher(
        string $userId,
        ?string $voucherCode,
        float $itemsTotal,
        float $shippingTotal,
        array $groups,
        array $storeSubtotals,
        array $shippingBreakdown
    ): array {
        $code = strtolower(trim((string) $voucherCode));

        if ($code === '') {
            return [null, 0.0, 0.0];
        }

        $voucher = DB::table('vouchers')
            ->leftJoin('stores', 'stores.id', '=', 'vouchers.store_id')
            ->select('vouchers.*', 'stores.status as store_status', 'stores.is_active as store_is_active', 'stores.deleted_at as store_deleted_at')
            ->where('vouchers.code', $code)
            ->where('vouchers.is_active', true)
            ->whereNull('vouchers.deleted_at')
            ->lockForUpdate()
            ->first();

        if (! $voucher) {
            throw new RuntimeException('Voucher tidak dikenali.');
        }

        if (now()->lt($voucher->starts_at) || now()->gt($voucher->ends_at)) {
            throw new RuntimeException('Voucher sudah kedaluwarsa atau belum berlaku.');
        }

        if ((int) $voucher->usage_limit > 0 && (int) $voucher->used_count >= (int) $voucher->usage_limit) {
            throw new RuntimeException('Kuota penggunaan voucher sudah habis.');
        }

        $scope = strtolower((string) $voucher->voucher_scope);
        $targetStoreId = $voucher->store_id !== null ? (int) $voucher->store_id : null;

        if ($scope === 'platform') {
            if ($targetStoreId !== null) {
                throw new RuntimeException('Konfigurasi voucher platform tidak valid.');
            }
            $eligibleSubtotal = $itemsTotal;
            $eligibleShipping = $shippingTotal;
            $eligibleStoreIds = array_keys($storeSubtotals);
        } elseif ($scope === 'store') {
            if ($targetStoreId === null || ! array_key_exists($targetStoreId, $storeSubtotals)) {
                throw new RuntimeException('Voucher tidak berlaku untuk toko dalam pesanan ini.');
            }
            if ((string) $voucher->store_status !== 'approved' || ! (bool) $voucher->store_is_active || $voucher->store_deleted_at !== null) {
                throw new RuntimeException('Toko pemilik voucher sedang tidak tersedia.');
            }
            $eligibleSubtotal = (float) ($storeSubtotals[$targetStoreId] ?? 0);
            $eligibleShipping = (float) ($shippingBreakdown[$targetStoreId] ?? 0);
            $eligibleStoreIds = [$targetStoreId];
        } else {
            throw new RuntimeException('Scope voucher tidak valid.');
        }

        if ($eligibleSubtotal < (float) $voucher->min_spend) {
            throw new RuntimeException('Minimal belanja voucher belum terpenuhi.');
        }

        // Syarat & ketentuan berbasis item (belanja minimal N item / N item berbeda).
        $totalItems = 0;
        $distinctProducts = 0;
        foreach ($groups as $storeId => $items) {
            if (! in_array((int) $storeId, array_map('intval', $eligibleStoreIds), true)) {
                continue;
            }
            $products = [];
            foreach ($items as $item) {
                $totalItems += (int) ($item['quantity'] ?? 0);
                $products[(int) ($item['product_id'] ?? 0)] = true;
            }
            $distinctProducts += count($products);
        }

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

        if ($voucher->max_discount !== null) {
            $discount = min($discount, (float) $voucher->max_discount);
        }

        $discount = min($baseAmount, max(0.0, $discount));

        return [
            (int) $voucher->id,
            $target === 'product' ? $discount : 0.0,
            $target === 'shipping' ? $discount : 0.0,
        ];
    }
}
