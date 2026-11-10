<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class RawMaterialCostHistoryModel extends Model
{
    protected $table = 'raw_material_cost_histories';

    protected $fillable = ['store_id', 'raw_material_id', 'raw_material_stock_movement_id', 'old_average_cost', 'new_average_cost', 'change_amount', 'change_percent', 'direction', 'reference_type', 'reference_number', 'occurred_at'];

    protected $casts = [
        'old_average_cost' => 'decimal:4',
        'new_average_cost' => 'decimal:4',
        'change_amount' => 'decimal:4',
        'change_percent' => 'decimal:4',
        'occurred_at' => 'datetime',
    ];

    public function material()
    {
        return $this->belongsTo(RawMaterialModel::class, 'raw_material_id');
    }
}
