<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class RawMaterialStockMovementModel extends Model
{
    protected $table = 'raw_material_stock_movements';

    protected $fillable = ['store_id', 'raw_material_id', 'type', 'quantity_delta', 'balance_after', 'unit_cost', 'total_cost', 'reference_type', 'reference_number', 'notes', 'occurred_at'];

    public function material()
    {
        return $this->belongsTo(RawMaterialModel::class, 'raw_material_id');
    }

    protected $casts = [
        'quantity_delta' => 'decimal:4',
        'balance_after' => 'decimal:4',
        'unit_cost' => 'decimal:4',
        'total_cost' => 'decimal:4',
        'occurred_at' => 'datetime',
    ];
}
