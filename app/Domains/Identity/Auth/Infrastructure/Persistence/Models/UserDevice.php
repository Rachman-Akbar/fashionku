<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class UserDevice extends Model
{
    use SoftDeletes;

    protected $table = 'user_devices';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'device_name',
        'device_type',
        'browser',
        'browser_version',
        'os',
        'os_version',
        'ip_address',
        'sanctum_token_id',
        'sanctum_token_name',
        'last_active_at',
        'expires_at',
        'status',
        'metadata',
    ];

    protected $casts = [
        'last_active_at' => 'datetime',
        'expires_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected $dates = [
        'last_active_at',
        'expires_at',
        'deleted_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isRevoked(): bool
    {
        return $this->status === 'revoked';
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function markAsRevoked(): void
    {
        $this->status = 'revoked';
        $this->save();
    }

    public function markAsInactive(): void
    {
        $this->status = 'inactive';
        $this->save();
    }

    public function updateLastActive(): void
    {
        $this->last_active_at = now();
        $this->save();
    }
}