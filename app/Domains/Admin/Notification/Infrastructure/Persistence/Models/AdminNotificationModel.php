<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class AdminNotificationModel extends Model
{
    use SoftDeletes;

    protected $table = 'admin_notifications';

    protected $fillable = [
        'user_id',
        'actor_id',
        'store_id',
        'module',
        'type',
        'title',
        'message',
        'reference_type',
        'reference_id',
        'url',
        'meta',
        'read_at',
        'is_active',
    ];

    protected $casts = [
        'store_id' => 'integer',
        'meta' => 'array',
        'read_at' => 'datetime',
        'is_active' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(StoreModel::class, 'store_id');
    }
}
