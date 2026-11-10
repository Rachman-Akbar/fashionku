<?php

declare(strict_types=1);

namespace App\Domains\Identity\Auth\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class RegistrationChallenge extends Model
{
    use SoftDeletes;

    protected $table = 'registration_challenges';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'email',
        'name',
        'password_hash',
        'phone',
        'firebase_uid',
        'avatar',
        'otp_challenge_id',
        'ip_address',
        'user_agent',
        'metadata',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected $dates = [
        'expires_at',
        'deleted_at',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function getTimeRemaining(): int
    {
        return max(0, (int) $this->expires_at->diffInSeconds(now()));
    }
}