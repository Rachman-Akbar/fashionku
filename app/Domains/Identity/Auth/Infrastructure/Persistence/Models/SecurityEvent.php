<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class SecurityEvent extends Model
{
    use SoftDeletes;

    protected $table = 'security_events';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'email',
        'event_type',
        'purpose',
        'severity',
        'ip_address',
        'user_agent',
        'metadata',
        'success',
        'failure_reason',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'metadata' => 'array',
        'success' => 'boolean',
    ];

    protected $dates = [
        'occurred_at',
        'deleted_at',
    ];

    public function isCritical(): bool
    {
        return $this->severity === 'critical';
    }

    public function isFailed(): bool
    {
        return ! $this->success;
    }
}