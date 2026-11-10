<?php

declare(strict_types=1);

namespace App\Domains\Seller\Stores\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

final class StoreModel extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'stores';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'short_description',
        'phone',
        'email',
        'city',
        'province',
        'address',
        'status',
        'is_active',
        'store_type',
        'logo',
        'banner_url',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function scopePubliclyAvailable(Builder $query): Builder
    {
        return $query
            ->where($this->qualifyColumn('status'), 'approved')
            ->where($this->qualifyColumn('is_active'), true);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detail(): HasOne
    {
        return $this->hasOne(StoreDetailModel::class, 'store_id');
    }

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
}
