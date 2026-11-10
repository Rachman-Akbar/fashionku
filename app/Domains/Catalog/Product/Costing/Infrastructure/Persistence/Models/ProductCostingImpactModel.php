<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialCostHistoryModel;
use App\Domains\Seller\Inventory\Infrastructure\Persistence\Models\RawMaterialModel;
use Illuminate\Database\Eloquent\Model;

final class ProductCostingImpactModel extends Model
{
    protected $table = 'product_costing_impacts';

    protected $fillable = ['store_id', 'product_id', 'raw_material_id', 'raw_material_cost_history_id', 'old_material_cost', 'new_material_cost', 'old_hpp', 'new_hpp', 'hpp_change_amount', 'hpp_change_percent', 'old_suggested_price', 'new_suggested_price', 'trigger_type', 'occurred_at'];

    protected $casts = [
        'old_material_cost' => 'decimal:4',
        'new_material_cost' => 'decimal:4',
        'old_hpp' => 'decimal:4',
        'new_hpp' => 'decimal:4',
        'hpp_change_amount' => 'decimal:4',
        'hpp_change_percent' => 'decimal:4',
        'old_suggested_price' => 'decimal:2',
        'new_suggested_price' => 'decimal:2',
        'occurred_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function material()
    {
        return $this->belongsTo(RawMaterialModel::class, 'raw_material_id');
    }

    public function costHistory()
    {
        return $this->belongsTo(RawMaterialCostHistoryModel::class, 'raw_material_cost_history_id');
    }
}
