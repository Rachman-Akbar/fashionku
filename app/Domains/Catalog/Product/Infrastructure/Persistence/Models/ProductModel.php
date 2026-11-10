<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Product\Infrastructure\Persistence\Models;

use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

final class ProductModel extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'products';

    protected $fillable = [
        'store_id',
        'primary_category_id',
        'name',
        'slug',
        'description',
        'brand',
        'thumbnail',
        'status',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'store_id' => 'integer',
        'primary_category_id' => 'integer',
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (mixed $value): string => trim((string) preg_replace('/\s+/u', ' ', (string) $value))
        );
    }

    protected function status(): Attribute
    {
        return Attribute::make(
            set: fn (mixed $value): string => Str::lower(trim((string) $value))
        );
    }

    public function store()
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }

    public function primaryCategory()
    {
        return $this->belongsTo(CategoryModel::class, 'primary_category_id');
    }

    public function categories()
    {
        return $this->belongsToMany(
            CategoryModel::class,
            'product_categories',
            'product_id',
            'category_id'
        )->withPivot('is_primary');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariantModel::class, 'product_id');
    }

    public function attributeValues()
    {
        return $this->hasMany(ProductAttributeValueModel::class, 'product_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImageModel::class, 'product_id', 'id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReviewModel::class, 'product_id')->where('is_active', true);
    }
}
