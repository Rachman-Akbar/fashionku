<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Costing\Infrastructure\Persistence\Models;

use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Database\Eloquent\Model;

final class ProductCostingModel extends Model
{
    protected $table = 'product_costings';

    protected $fillable = ['product_id', 'store_id', 'material_cost', 'labor_cost', 'overhead_cost', 'other_cost', 'hpp', 'margin_percent', 'suggested_price', 'selling_price'];

    protected $casts = ['material_cost' => 'decimal:4', 'labor_cost' => 'decimal:4', 'overhead_cost' => 'decimal:4', 'other_cost' => 'decimal:4', 'hpp' => 'decimal:4', 'margin_percent' => 'decimal:4', 'suggested_price' => 'decimal:2', 'selling_price' => 'decimal:2'];

    public function product()
    {
        return $this->belongsTo(ProductModel::class, 'product_id');
    }

    public function store()
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }
}
