<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class RawMaterialModel extends Model
{
    use SoftDeletes;

    protected $table = 'raw_materials';

    protected $fillable = ['store_id', 'code', 'name', 'unit', 'stock', 'minimum_stock', 'average_cost', 'is_active'];

    protected $casts = [
        'store_id' => 'integer',
        'stock' => 'decimal:4',
        'minimum_stock' => 'decimal:4',
        'average_cost' => 'decimal:4',
        'is_active' => 'boolean',
    ];
}
