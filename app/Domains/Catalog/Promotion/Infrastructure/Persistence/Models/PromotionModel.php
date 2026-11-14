<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models;

use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class PromotionModel extends Model
{
    use HasActiveStatus;
    use SoftDeletes;
    use TracksUserChanges;

    protected $table = 'promotions';

    protected $fillable = [
        'promotion_payment_id',
        'name',
        'image_url',
        'mobile_image_url',
        'click_action',
        'target_id',
        'target_url',
        'sort_order',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'promotion_payment_id' => 'integer',
        'target_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(PromotionPaymentModel::class, 'promotion_payment_id');
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (mixed $value): string => trim((string) preg_replace('/\s+/u', ' ', (string) $value))
        );
    }
}
