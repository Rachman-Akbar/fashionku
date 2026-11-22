<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Models;

use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use Illuminate\Database\Eloquent\Model;

final class ProductVariantMaterialModel extends Model
{
    protected $table = 'product_variant_materials';

    protected $fillable = [
        'variant_id',
        'raw_material_id',
        'quantity',
        'unit_cost',
        'total_cost',
    ];

    protected $casts = [
        'variant_id' => 'integer',
        'raw_material_id' => 'integer',
        'quantity' => 'decimal:4',
        'unit_cost' => 'decimal:4',
        'total_cost' => 'decimal:4',
    ];

    public function variant()
    {
        return $this->belongsTo(ProductVariantModel::class, 'variant_id');
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterialModel::class, 'raw_material_id');
    }
}
