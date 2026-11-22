<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\Excel;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductVariantModel;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SalesImport extends BaseImport
{
    use \Maatwebsite\Excel\Concerns\Importable;

    protected string $modelClass = 'Order';
    protected string $uniqueKey = 'kode_invoice';

    protected array $relationMappings = [
        'kode_pelanggan' => [
            'model' => User::class,
            'search_column' => 'id', // We'll handle this specially via seller_customers
            'target_column' => 'user_id',
            'target_key' => 'id',
            'create_missing' => false,
        ],
        'kode_produk' => [
            'model' => ProductVariantModel::class,
            'search_column' => 'sku',
            'target_column' => 'product_variant_id',
            'target_key' => 'id',
            'create_missing' => false,
        ],
        'kode_voucher' => [
            'model' => Voucher::class,
            'search_column' => 'code',
            'target_column' => 'voucher_id',
            'target_key' => 'id',
            'create_missing' => false,
        ],
        'username_kasir' => [
            'model' => User::class,
            'search_column' => 'name', // or username if exists
            'target_column' => 'cashier_id',
            'target_key' => 'id',
            'create_missing' => false,
        ],
    ];

    public function model(): string
    {
        return \App\Domains\Order\Ordering\Infrastructure\Persistence\Models\OrderModel::class;
    }

    public function uniqueKey(): string
    {
        return 'kode_invoice';
    }

    protected function getDatabaseKeyColumn(): string
    {
        return 'order_number';
    }

    public function rules(): array
    {
        return [
            'kode_invoice' => 'required|string|max:50',
            'tanggal' => 'nullable|date_format:Y-m-d',
            'kode_pelanggan' => 'nullable|string|max:100',
            'nama_pelanggan' => 'nullable|string|max:255',
            'email_pelanggan' => 'nullable|email|max:255',
            'telepon_pelanggan' => 'nullable|string|max:20',
            'kode_produk' => 'required|string|max:100|exists:product_variants,sku',
            'nama_produk' => 'nullable|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'harga_satuan' => 'required|numeric|min:0',
            'kode_voucher' => 'nullable|string|max:50|exists:vouchers,code',
            'ongkir' => 'nullable|numeric|min:0',
            'diskon' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'status' => 'nullable|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'catatan' => 'nullable|string',
            'username_kasir' => 'nullable|string|max:255',
        ];
    }

    public function customValidation(array $row): array
    {
        $errors = [];

        if (empty($row['kode_invoice'])) {
            $errors['kode_invoice'] = 'Kode invoice wajib diisi';
        }

        if (empty($row['kode_produk'])) {
            $errors['kode_produk'] = 'Kode produk (SKU) wajib diisi';
        }

        if (! isset($row['jumlah']) || $row['jumlah'] < 1) {
            $errors['jumlah'] = 'Jumlah minimal 1';
        }

        if (! isset($row['harga_satuan']) || $row['harga_satuan'] < 0) {
            $errors['harga_satuan'] = 'Harga satuan tidak valid';
        }

        if (! isset($row['total']) || $row['total'] < 0) {
            $errors['total'] = 'Total tidak valid';
        }

        return $errors;
    }

    protected function findExisting(string $uniqueValue)
    {
        return DB::table('orders')->where('order_number', $uniqueValue)->first();
    }

    protected function preparePayload(array $data, $existing = null): array
    {
        // Kolom yang benar-benar ada di tabel orders: order_number, user_id, voucher_id,
        // total_amount, discount_amount, status, payment_status, shipping_address, pickup_note.
        // Tidak ada shipping_cost / voucher_code / cashier_id / notes.
        $payload = [
            'order_number' => trim((string) ($data['kode_invoice'] ?? '')),
            // Import penjualan dilakukan seller/admin, sama seperti order manual.
            'order_type' => 'manual',
            'total_amount' => (float) ($data['total'] ?? 0),
            'discount_amount' => (float) ($data['diskon'] ?? 0),
            'status' => $data['status'] ?? 'pending',
            'pickup_note' => mb_substr((string) ($data['catatan'] ?? ''), 0, 255),
        ];

        if (isset($data['tanggal']) && $data['tanggal']) {
            $payload['created_at'] = \Carbon\Carbon::parse($data['tanggal'])->startOfDay();
        }

        $payload['updated_at'] = now();

        return $payload;
    }

    public function collection(Collection $rows): void
    {
        DB::transaction(function () use ($rows) {
            $orderItems = [];

            foreach ($rows as $index => $row) {
                $rowNumber = $index + 2;

                try {
                    $data = $row->toArray();
                    $data = $this->normalizeData($data);

                    $uniqueValue = $this->getUniqueValue($data);
                    if (! $uniqueValue) {
                        throw new \InvalidArgumentException("Kode invoice wajib diisi");
                    }

                    $existing = $this->findExisting($uniqueValue);

                    // Resolve customer
                    $customerId = $this->resolveCustomer($data);
                    $payload = $this->preparePayload($data, $existing);
                    // user_id & shipping_address wajib (NOT NULL) di tabel orders.
                    $payload['user_id'] = $customerId ?: $this->createGuestCustomer($data);
                    $payload['shipping_address'] = $this->resolveShippingAddress($payload['user_id'], $data);

                    // Resolve voucher
                    if (! empty($data['kode_voucher'])) {
                        $voucher = Voucher::whereRaw('LOWER(TRIM(code)) = ?', [strtolower(trim($data['kode_voucher']))])->first();
                        if ($voucher) {
                            $payload['voucher_id'] = $voucher->id;
                        }
                    }

                    $orderId = null;

                    if ($existing) {
                        $orderId = $existing->id;
                        DB::table('orders')->where('id', $orderId)->update($payload);
                        // Hapus item lama (order_items bergantung ke sub_orders).
                        $subOrderIds = DB::table('sub_orders')->where('order_id', $orderId)->pluck('id');
                        if ($subOrderIds->isNotEmpty()) {
                            DB::table('order_items')->whereIn('sub_order_id', $subOrderIds)->delete();
                            DB::table('sub_orders')->whereIn('id', $subOrderIds)->delete();
                        }
                    } else {
                        $payload['created_at'] = $payload['created_at'] ?? now();
                        $payload['updated_at'] = now();
                        $orderId = DB::table('orders')->insertGetId($payload);
                    }

                    // Buat sub order (struktur orders -> sub_orders -> order_items).
                    $variant = ProductVariantModel::whereRaw('LOWER(TRIM(sku)) = ?', [strtolower(trim($data['kode_produk']))])->first();

                    if ($variant) {
                        $quantity = (int) ($data['jumlah'] ?? 1);
                        $price = (float) ($data['harga_satuan'] ?? 0);

                        $subOrderId = DB::table('sub_orders')->insertGetId([
                            'order_id' => $orderId,
                            'sub_order_number' => $payload['order_number'] . '-S1',
                            'total_items_price' => $quantity * $price,
                            'shipping_cost' => (float) ($data['ongkir'] ?? 0),
                            // destination_id wajib diisi; import tidak punya data tujuan kurir.
                            'destination_id' => 'MANUAL',
                            'status' => $payload['status'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $productName = trim((string) ($data['nama_produk'] ?? ''));
                        if ($productName === '') {
                            $productName = (string) ($variant->product?->name ?? $variant->sku);
                        }

                        DB::table('order_items')->insert([
                            'sub_order_id' => $subOrderId,
                            'product_id' => $variant->product_id,
                            'variant_id' => $variant->id,
                            'product_name' => $productName,
                            'sku' => $variant->sku,
                            'thumbnail' => $variant->product?->thumbnail,
                            'price' => $price,
                            'quantity' => $quantity,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    $this->importedCount++;
                } catch (\Throwable $e) {
                    $this->failedCount++;
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'data' => $row->toArray(),
                        'error' => $e->getMessage(),
                    ];
                    \Illuminate\Support\Facades\Log::error("Sales import error at row {$rowNumber}: " . $e->getMessage());
                }
            }
        });
    }

    /**
     * Alamat pengiriman mengikuti format order manual (JSON
     * recipient/phone/address) supaya halaman detail order dapat membacanya.
     */
    protected function resolveShippingAddress(string $userId, array $data = []): string
    {
        $user = DB::table('users')->where('id', $userId)->first(['name']);
        $address = DB::table('addresses')
            ->where('user_id', $userId)
            ->orderByDesc('is_primary')
            ->first(['recipient_name', 'phone_number', 'full_address']);

        $recipient = trim((string) ($address->recipient_name ?? $user->name ?? $data['nama_pelanggan'] ?? ''));
        $phone = trim((string) ($address->phone_number ?? $data['telepon_pelanggan'] ?? ''));
        $street = trim((string) ($address->full_address ?? ''));

        return (string) json_encode([
            'recipient' => $recipient !== '' ? $recipient : 'Pelanggan Umum',
            'phone' => $phone,
            'address' => $street !== '' ? $street : 'Datang langsung ke toko',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Baris tanpa pelanggan yang cocok tetap diimpor dengan akun guest,
     * sama seperti CreateManualOrderUseCase.
     */
    protected function createGuestCustomer(array $data): string
    {
        $email = strtolower(trim((string) ($data['email_pelanggan'] ?? '')));
        if ($email === '') {
            $email = 'guest-'.Str::lower(Str::random(12)).'@manual.order';
        }

        $name = trim((string) ($data['nama_pelanggan'] ?? ''));
        $userId = (string) Str::uuid();

        DB::table('users')->insert([
            'id' => $userId,
            'email' => $email,
            'name' => $name !== '' ? $name : 'Pelanggan Umum',
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

    protected function resolveCustomer(array $data): ?string
    {
        // Priority 1: kode_pelanggan from seller_customers
        if (! empty($data['kode_pelanggan'])) {
            $customer = DB::table('seller_customers')
                ->join('users', 'users.id', '=', 'seller_customers.user_id')
                ->where('seller_customers.code', strtolower(trim($data['kode_pelanggan'])))
                ->where('users.is_active', true)
                ->select('users.id')
                ->first();
            if ($customer) {
                return $customer->id;
            }
        }

        // Priority 2: email_pelanggan
        if (! empty($data['email_pelanggan'])) {
            $user = User::whereRaw('LOWER(TRIM(email)) = ?', [strtolower(trim($data['email_pelanggan']))])
                ->where('is_active', true)
                ->first();
            if ($user) {
                return $user->id;
            }
        }

        // Priority 3: nama_pelanggan + telepon (fuzzy match).
        // Nomor telepon ada di tabel addresses (phone_number), bukan di users.
        if (! empty($data['nama_pelanggan']) && ! empty($data['telepon_pelanggan'])) {
            $phone = preg_replace('/\D+/', '', (string) $data['telepon_pelanggan']);

            if ($phone !== '' && $phone !== null) {
                $user = User::query()
                    ->whereRaw('LOWER(TRIM(users.name)) = ?', [strtolower(trim($data['nama_pelanggan']))])
                    ->where('users.is_active', true)
                    ->whereExists(function ($query) use ($phone): void {
                        $query->select(DB::raw(1))
                            ->from('addresses')
                            ->whereColumn('addresses.user_id', 'users.id')
                            ->whereRaw(
                                "REPLACE(REPLACE(REPLACE(REPLACE(addresses.phone_number, ' ', ''), '-', ''), '+', ''), '.', '') LIKE ?",
                                ['%' . $phone]
                            );
                    })
                    ->first();

                if ($user) {
                    return $user->id;
                }
            }
        }

        return null;
    }
}
