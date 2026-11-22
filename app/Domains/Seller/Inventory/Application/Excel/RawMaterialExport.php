<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Application\Excel;

use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use App\Domains\Shared\Excel\Application\Imports\BaseImport;
use App\Domains\Shared\Excel\Application\Templates\BaseTemplateExport;
use Illuminate\Support\Collection;

class RawMaterialExport extends BaseExport
{
    protected int $imageColumnIndex = 1;
    protected string $imagePathColumn = 'image';
    protected int $imageWidth = 80;
    protected int $imageHeight = 80;

    public function __construct(protected ?Collection $materials = null) {}

    public function collection(): Collection
    {
        return $this->materials ?? RawMaterialModel::all();
    }

    public function headings(): array
    {
        return [
            'kode_bahan',
            'image',
            'nama',
            'satuan',
            'stok_awal',
            'biaya_satuan',
            'stok_minimum',
            'aktif',
        ];
    }

    public function map($material): array
    {
        return [
            $material->code ?? '',
            $material->image ?? '',
            $material->name ?? '',
            $material->unit ?? '',
            $material->stock ?? 0,
            $material->average_cost ?? 0,
            $material->minimum_stock ?? 0,
            $material->is_active ? 'ya' : 'tidak',
        ];
    }
}
