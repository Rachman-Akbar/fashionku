<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Domain\ValueObjects\VariantDetails;
use App\Domains\Order\Ordering\Domain\Entities\Order;
use App\Domains\Order\Ordering\Domain\Entities\OrderItem;
use App\Domains\Order\Ordering\Domain\Entities\SubOrder;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Order\Payment\Domain\Entities\Payment;
use App\Domains\Order\Payment\Domain\Repositories\PaymentRepositoryInterface;
use App\Domains\Seller\Stock\Application\Services\StockMovementService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Membuat order manual oleh seller (fungsi kasir/offline).
 *
 * Berbeda dari CreateOrderUseCase: tidak lewat keranjang pembeli, tidak ada
 * voucher, dan tidak memakai Midtrans. Pembayaran cukup dicatat sebagai
 * paid/unpaid sesuai metode yang dipilih seller.
 */
final class CreateManualOrderUseCase
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private ProductForCartReaderInterface $productReader,
        private PaymentRepositoryInterface $paymentRepository,
        private StockMovementService $stockMovementService,
        private CodePatternService $codePatterns
    ) {}

    /**
     * @param  array<int, array{variant_id: int, quantity: int}>  $itemInputs
     * @param  array{name?: string, phone?: string, email?: ?string, address?: string}  $customer
     */
    public function execute(
        int $storeId,
        array $itemInputs,
        array $customer,
        string $courier,
        ?string $service,
        float $shippingCost,
        string $paymentMethod,
        string $paymentStatus,
        string $status,
        string $orderType = 'normal',
        ?string $preorderReleaseAt = null,
        ?string $scheduledAt = null,
        ?string $orderNumber = null
    ): Order {
        $courier = strtolower(trim($courier));
        $paymentMethod = strtolower(trim($paymentMethod));
        $orderType = strtolower(trim($orderType));

        if (! in_array($orderType, ['manual', 'normal', 'preorder', 'booking'], true)) {
            throw new RuntimeException('Metode pembelian tidak valid.');
        }
        if ($orderType === 'booking' && $scheduledAt === null) {
            throw new RuntimeException('Tanggal kirim wajib diisi untuk metode pembelian booking.');
        }

        $inputs = [];
        foreach ($itemInputs as $input) {
            $variantId = (int) ($input['variant_id'] ?? 0);
            $quantity = (int) ($input['quantity'] ?? 0);
            if ($variantId <= 0 || $quantity <= 0) {
                continue;
            }
            $inputs[$variantId] = (int) ($inputs[$variantId] ?? 0) + $quantity;
        }

        if ($inputs === []) {
            throw new RuntimeException('Pilih minimal satu produk untuk order manual.');
        }

        $variantIds = array_keys($inputs);
        $detailsMap = $this->productReader->getVariantsDetails($variantIds);

        if (count($detailsMap) !== count($variantIds)) {
            throw new RuntimeException('Beberapa produk tidak tersedia untuk dijual.');
        }

        $stockRows = DB::table('product_variants')
            ->whereIn('id', $variantIds)
            ->lockForUpdate()
            ->get(['id', 'stock', 'stock_reserved', 'stock_booked'])
            ->keyBy('id');

        $items = [];
        $itemsTotal = 0.0;

        foreach ($inputs as $variantId => $quantity) {
            /** @var VariantDetails $details */
            $details = $detailsMap[$variantId];

            if ($details->getStoreId() !== $storeId) {
                throw new RuntimeException("Produk {$details->getProductName()} bukan milik toko Anda.");
            }

            $stockRow = $stockRows[(int) $variantId] ?? null;
            $available = $stockRow
                ? max(0, (int) $stockRow->stock - (int) $stockRow->stock_reserved - (int) $stockRow->stock_booked)
                : $details->getStock();

            if ($quantity > $available) {
                throw new RuntimeException(
                    "Stok {$details->getProductName()} tidak mencukupi. Tersedia {$available} unit. Kurangi jumlah pesanan."
                );
            }

            $label = $details->getName() && $details->getName() !== $details->getProductName()
                ? $details->getProductName().' - '.$details->getName()
                : $details->getProductName();

            $items[] = new OrderItem(
                id: null,
                productId: $details->getProductId(),
                variantId: (int) $variantId,
                storeId: $storeId,
                productName: $label,
                sku: $details->getSku(),
                thumbnail: $details->getThumbnail(),
                price: (float) $details->getPrice()->getAmount(),
                quantity: $quantity
            );

            $itemsTotal += (float) $details->getPrice()->getAmount() * $quantity;
        }

        $userId = $this->resolveCustomerUserId($storeId, $customer);

        $providedOrderNumber = strtoupper(trim((string) $orderNumber));
        $orderNumber = $providedOrderNumber !== ''
            ? $providedOrderNumber
            : $this->codePatterns->unique('order_number', $storeId, [
                'type' => 'MAN',
                'store' => (string) ($customer['store_name'] ?? ''),
                'seq' => (int) DB::table('orders')->where('store_id', $storeId)->count() + 1,
            ], fn (string $candidate): bool => DB::table('orders')->where('order_number', $candidate)->exists());
        $shippingAddress = $this->shippingAddress($customer, $courier);
        $grossAmount = max(0.0, $itemsTotal + $shippingCost);
        $paid = $paymentStatus === 'paid';

        $order = new Order(
            id: null,
            orderNumber: $orderNumber,
            orderType: $orderType,
            preorderReleaseAt: $orderType === 'preorder' ? $preorderReleaseAt : null,
            scheduledAt: $orderType === 'booking' ? $scheduledAt : null,
            receivedAt: $paid ? now()->toDateTimeString() : null,
            userId: $userId,
            voucherId: null,
            totalAmount: $itemsTotal + $shippingCost,
            discountAmount: 0.0,
            shippingDiscountAmount: 0.0,
            status: $paid ? $this->effectiveActiveStatus($status) : 'pending',
            paymentStatus: $paid ? 'paid' : 'unpaid',
            paymentMethod: $paymentMethod,
            snapToken: null,
            shippingAddress: $shippingAddress,
            subOrders: [
                new SubOrder(
                    id: null,
                    storeId: $storeId,
                    storeName: (string) $customer['store_name'],
                    subOrderNumber: $orderNumber.'-S'.$storeId,
                    totalItemsPrice: $itemsTotal,
                    shippingCost: $shippingCost,
                    courier: $courier,
                    service: $service ? strtoupper(trim($service)) : null,
                    destinationId: 'MANUAL-'.$storeId,
                    status: $paid ? $this->effectiveActiveStatus($status) : 'pending',
                    trackingNumber: null,
                    items: $items
                ),
            ]
        );

        $created = DB::transaction(function () use ($order, $paid, $grossAmount, $paymentMethod, $orderNumber): Order {
            $createdOrder = $this->orderRepository->create($order);

            $this->stockMovementService->reserveCheckout((int) $createdOrder->id);
            if ($paid) {
                $this->stockMovementService->commitCheckout((int) $createdOrder->id);
            }

            $this->paymentRepository->save(new Payment(
                id: null,
                orderNumber: $orderNumber,
                transactionId: null,
                paymentMethod: $paymentMethod,
                amount: $grossAmount,
                status: $paid ? 'success' : 'pending',
                payload: ['source' => 'manual']
            ));

            return $createdOrder;
        });

        return $created;
    }

    private function effectiveActiveStatus(string $status): string
    {
        return in_array($status, ['processing', 'shipped', 'received', 'completed'], true) ? $status : 'processing';
    }

    private function shippingAddress(array $customer, string $courier): string
    {
        if ($courier === 'ambil_sendiri' || $courier === 'pickup') {
            return 'Ambil sendiri di toko';
        }

        $recipient = trim((string) ($customer['name'] ?? ''));
        $address = trim((string) ($customer['address'] ?? ''));

        return json_encode([
            'recipient' => $recipient !== '' ? $recipient : 'Pelanggan Umum',
            'phone' => trim((string) ($customer['phone'] ?? '')),
            'address' => $address !== '' ? $address : 'Datang langsung ke toko',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private function resolveCustomerUserId(int $storeId, array $customer): string
    {
        $email = strtolower(trim((string) ($customer['email'] ?? '')));

        if ($email !== '') {
            $existing = DB::table('users')->where('email', $email)->whereNull('deleted_at')->first();
            if ($existing) {
                return (string) $existing->id;
            }
        }

        $candidateEmail = $email !== '' ? $email : 'guest-'.$storeId.'-'.Str::lower(Str::random(12)).'@manual.order';

        $userId = (string) Str::uuid();
        $userName = trim((string) ($customer['name'] ?? ''));
        DB::table('users')->insert([
            'id' => $userId,
            'email' => $candidateEmail,
            'name' => $userName !== '' ? $userName : 'Pelanggan Umum',
            'password' => null,
            'is_email_verified' => false,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $roleId = DB::table('roles')
            ->where('name', 'buyer')
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->value('id');

        if ($roleId !== null) {
            DB::table('user_roles')->updateOrInsert(
                ['user_id' => $userId, 'role_id' => (int) $roleId],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        return $userId;
    }
}
