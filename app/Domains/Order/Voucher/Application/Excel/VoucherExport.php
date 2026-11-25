<?php

declare(strict_types=1);

namespace App\Domains\Order\Voucher\Application\Excel;

use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class VoucherExport extends BaseExport
{
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'image';
    protected int $imageWidth = 80;
    protected int $imageHeight = 80;

    public function __construct(protected ?Collection $vouchers = null) {}

    public function collection(): Collection
    {
        return $this->vouchers ?? Voucher::with('voucherProducts')->get();
    }

    public function headings(): array
    {
        return [
            'kode_voucher',
            'image',
            'nama',
            'target_diskon',
            'tipe_diskon',
            'nilai_diskon',
            'min_belanja',
            'min_item',
            'min_produk_berbeda',
            'min_qty_produk_sama',
            'maks_diskon',
            'mulai',
            'berakhir',
            'limit_pemakaian',
            'limit_per_user',
            'syarat_ketentuan',
            'produk_terkait',
            'aktif',
        ];
    }

    public function map($voucher): array
    {
        $productCodes = $voucher->voucherProducts->pluck('sku')->implode(';');

        return [
            $voucher->code ?? '',
            $voucher->image ?? '',
            $voucher->name ?? '',
            $voucher->discount_target ?? 'product',
            $voucher->discount_type ?? 'percentage',
            $voucher->discount_value ?? 0,
            $voucher->min_spend ?? 0,
            $voucher->min_items ?? 0,
            $voucher->min_distinct_products ?? 0,
            $voucher->min_same_product_qty ?? 0,
            $voucher->max_discount ?? 0,
            $voucher->starts_at ? \Carbon\Carbon::parse($voucher->starts_at)->format('Y-m-d H:i') : '',
            $voucher->ends_at ? \Carbon\Carbon::parse($voucher->ends_at)->format('Y-m-d H:i') : '',
            $voucher->usage_limit ?? 0,
            $voucher->usage_limit_per_user ?? 0,
            $voucher->terms ?? '',
            $productCodes,
            $voucher->is_active ? 'ya' : 'tidak',
        ];
    }
}
