<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Application\Excel;

use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionModel;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class PromotionExport extends BaseExport
{
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'image_url';
    protected int $imageWidth = 120;
    protected int $imageHeight = 80;

    public function __construct(protected ?Collection $promotions = null) {}

    public function collection(): Collection
    {
        return $this->promotions ?? PromotionModel::with('payment.user')->get();
    }

    public function headings(): array
    {
        return [
            'image_url',
            'mobile_image_url',
            'nama',
            'jenis_klik',
            'target_id',
            'target_url',
            'urutan',
            'aktif',
            'pembayaran_kode',
            'pembayaran_user',
            'paket',
            'jumlah_bayar',
        ];
    }

    public function map($promotion): array
    {
        return [
            $promotion->image_url ?? '',
            $promotion->mobile_image_url ?? '',
            $promotion->name ?? '',
            $promotion->click_action ?? 'none',
            $promotion->target_id ?? '',
            $promotion->target_url ?? '',
            $promotion->sort_order ?? 0,
            $promotion->is_active ? 'ya' : 'tidak',
            $promotion->payment?->payment_number ?? '',
            $promotion->payment?->user?->name ?? '',
            $promotion->payment?->package_name ?? '',
            $promotion->payment?->amount ?? 0,
        ];
    }
}
