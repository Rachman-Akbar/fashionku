<?php

namespace App\Domains\Seller\Stores\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreDetailModel extends Model
{
    protected $table = 'store_details';

    protected $fillable = [
        'store_id',
        'owner_name',
        'owner_phone',
        'description',
        'shipping_policy',
        'return_policy',
        'open_days',
        'open_time',
        'close_time',
        'whatsapp_url',
        'instagram_url',
        'tiktok_url',
        'website_url',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }
}
