<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\Excel;

use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Export penjualan: satu baris per item pesanan.
 *
 * Catatan: `map()` pada WithMapping hanya boleh mengembalikan SATU baris,
 * sehingga penggandaan per item dikerjakan di collection() — bukan dengan
 * mengembalikan array-of-array dari map() (dulu hasilnya rusak).
 *
 * Kolom yang dipakai dibatasi pada yang benar-benar ada di skema:
 * telepon pembeli ada di `addresses.phone_number` (bukan `users.phone`),
 * kode voucher di `vouchers.code` (bukan `orders.voucher_code`), dan ongkir
 * di `sub_orders.shipping_cost`.
 */
class SalesExport extends BaseExport
{
    public function __construct(protected ?Collection $orders = null) {}

    public function collection(): Collection
    {
        $query = DB::table('order_items')
            ->join('sub_orders', 'sub_orders.id', '=', 'order_items.sub_order_id')
            ->join('orders', 'orders.id', '=', 'sub_orders.order_id')
            ->join('users', 'users.id', '=', 'orders.user_id')
            ->leftJoin('seller_customers', 'seller_customers.user_id', '=', 'users.id')
            ->leftJoin('addresses as primary_address', function ($join): void {
                $join->on('primary_address.user_id', '=', 'users.id')
                    ->where('primary_address.is_primary', true);
            })
            ->leftJoin('vouchers', 'vouchers.id', '=', 'orders.voucher_id')
            ->select(
                'orders.id as order_id',
                'orders.order_number',
                'orders.created_at',
                'orders.total_amount',
                'orders.discount_amount',
                'orders.status',
                'users.name as customer_name',
                'users.email as customer_email',
                'primary_address.phone_number as customer_phone',
                'seller_customers.code as customer_code',
                'vouchers.code as voucher_code',
                'sub_orders.shipping_cost as shipping_cost',
                'order_items.sku as product_sku',
                'order_items.product_name as product_name',
                'order_items.quantity',
                'order_items.price'
            );

        if ($this->orders) {
            $ids = $this->orders->pluck('id')->filter()->all();

            if ($ids === []) {
                return collect();
            }

            $query->whereIn('orders.id', $ids);
        }

        return $query->orderByDesc('orders.created_at')->get();
    }

    public function headings(): array
    {
        return [
            'kode_invoice',
            'tanggal',
            'kode_pelanggan',
            'nama_pelanggan',
            'email_pelanggan',
            'telepon_pelanggan',
            'kode_produk',
            'nama_produk',
            'jumlah',
            'harga_satuan',
            'kode_voucher',
            'ongkir',
            'diskon',
            'total',
            'status',
            'catatan',
        ];
    }

    public function map($row): array
    {
        return [
            $row->order_number ?? '',
            $row->created_at ? \Carbon\Carbon::parse($row->created_at)->format('Y-m-d') : '',
            $row->customer_code ?? '',
            $row->customer_name ?? '',
            $row->customer_email ?? '',
            $row->customer_phone ?? '',
            $row->product_sku ?? '',
            $row->product_name ?? '',
            $row->quantity ?? 0,
            $row->price ?? 0,
            $row->voucher_code ?? '',
            $row->shipping_cost ?? 0,
            $row->discount_amount ?? 0,
            $row->total_amount ?? 0,
            $row->status ?? 'pending',
            '',
        ];
    }
}
