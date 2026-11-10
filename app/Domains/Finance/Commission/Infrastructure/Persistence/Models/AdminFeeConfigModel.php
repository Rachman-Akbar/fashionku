<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Infrastructure\Persistence\Models;

use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminFeeConfigModel extends Model
{
    use SoftDeletes;

    protected $table = 'admin_fee_configs';

    protected $fillable = [
        'category_id',
        'name',
        'code',
        'percentage',
        'fixed_amount',
        'min_fee',
        'max_fee',
        'is_active',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'percentage' => 'decimal:2',
        'fixed_amount' => 'decimal:2',
        'min_fee' => 'decimal:2',
        'max_fee' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(CategoryModel::class);
    }
}
