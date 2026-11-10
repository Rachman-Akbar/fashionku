<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Domains\Identity\User\Domain\Entities\User;

final class OtpChallenge extends Model
{
    use SoftDeletes;

    protected $table = 'otp_challenges';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'email',
        'phone',
        'purpose',
        'code_hash',
        'attempts',
        'max_attempts',
        'expires_at',
        'consumed_at',
        'challenge_id',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'consumed_at' => 'datetime',
        'metadata' => 'array',
        'attempts' => 'integer',
        'max_attempts' => 'integer',
    ];

    protected $dates = [
        'expires_at',
        'consumed_at',
        'deleted_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isConsumed(): bool
    {
        return $this->consumed_at !== null;
    }

    public function isMaxAttemptsReached(): bool
    {
        return $this->attempts >= $this->max_attempts;
    }

    public function getRemainingAttempts(): int
    {
        return max(0, $this->max_attempts - $this->attempts);
    }

    public function getTimeRemaining(): int
    {
        return max(0, (int) $this->expires_at->diffInSeconds(now()));
    }
}