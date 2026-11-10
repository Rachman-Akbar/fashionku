<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Domain\Entities;

use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

final class Permission extends Model
{
    use HasActiveStatus;

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (mixed $value): string => Str::lower(trim((string) $value))
        );
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions')->withTimestamps();
    }
}
