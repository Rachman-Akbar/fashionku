<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class ProductAttributeValueModel extends Model
{
    protected $table = 'product_attribute_values';

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'attribute_id',
        'value',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'attribute_id' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function attribute()
    {
        return $this->belongsTo(ProductAttributeModel::class, 'attribute_id');
    }
}
