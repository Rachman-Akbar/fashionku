<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Infrastructure\Persistence\Models;

use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Models\CatalogGroupModel;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Models\ProductModel;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class CategoryModel extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'categories';

    protected $fillable = [
        'catalog_group_id',
        'parent_id',
        'parent_scope_id',
        'level',
        'sort_order',
        'is_active',
        'is_visible_in_menu',
        'name',
        'slug',
        'full_slug',
        'image_url',
        'icon_url',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'catalog_group_id' => 'integer',
        'parent_id' => 'integer',
        'parent_scope_id' => 'integer',
        'level' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'is_visible_in_menu' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (mixed $value): string => trim((string) preg_replace('/\s+/u', ' ', (string) $value))
        );
    }

    public function catalogGroup(): BelongsTo
    {
        return $this->belongsTo(CatalogGroupModel::class, 'catalog_group_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function childrenTree(): HasMany
    {
        return $this->children()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->with('childrenTree');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            ProductModel::class,
            'product_categories',
            'category_id',
            'product_id'
        )->withPivot('is_primary');
    }
}
