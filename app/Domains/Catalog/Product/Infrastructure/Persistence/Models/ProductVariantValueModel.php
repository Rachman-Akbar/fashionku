<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class ProductVariantValueModel extends Model
{
    protected $table = 'product_variant_values';

    public $timestamps = false;

    protected $fillable = [
        'variant_id',
        'attribute_id',
        'value',
    ];

    protected $casts = [
        'variant_id' => 'integer',
        'attribute_id' => 'integer',
    ];

    public function variant()
    {
        return $this->belongsTo(ProductVariantModel::class, 'variant_id');
    }

    public function attribute()
    {
        return $this->belongsTo(ProductAttributeModel::class, 'attribute_id');
    }
}
