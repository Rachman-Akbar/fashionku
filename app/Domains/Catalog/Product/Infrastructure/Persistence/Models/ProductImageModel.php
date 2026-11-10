<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class ProductImageModel extends Model
{
    protected $table = 'product_images';

    protected $fillable = [
        'product_id',
        'url',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }
}
