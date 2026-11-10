<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Domain\Entities;

use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\HasActiveStatus;
use App\Domains\Shared\Infrastructure\Persistence\Concerns\TracksUserChanges;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

final class User extends Authenticatable
{
    use HasActiveStatus;
    use HasApiTokens;
    use HasUuids;
    use Notifiable;
    use SoftDeletes;
    use TracksUserChanges;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'firebase_uid',
        'email',
        'password',
        'has_set_password',
        'name',
        'avatar',
        'is_email_verified',
        'is_active',
        'banned_at',
        'created_by',
        'updated_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_email_verified' => 'boolean',
        'is_active' => 'boolean',
        'password' => 'hashed',
        'banned_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected function email(): Attribute
    {
        return Attribute::make(
            set: fn (mixed $value): string => Str::lower(trim((string) $value))
        );
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
            ->where('roles.is_active', true)
            ->withTimestamps();
    }

    public function allRoles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
            ->withTimestamps();
    }

    public function store(): HasOne
    {
        return $this->hasOne(
            StoreModel::class,
            'user_id',
            'id'
        );
    }

    public function hasRole(string $role): bool
    {
        $role = Str::lower(trim($role));

        return $this->roles->contains(
            fn ($item): bool => Str::lower((string) $item->name) === $role
        );
    }

    public function roleNames(): array
    {
        return $this->roles
            ->pluck('name')
            ->map(fn (string $role): string => Str::lower(trim($role)))
            ->unique()
            ->values()
            ->all();
    }

    public function hasPermission(string $permission): bool
    {
        $permission = Str::lower(trim($permission));

        return $this->roles()
            ->whereHas('permissions', fn ($query) => $query
                ->where('permissions.name', $permission)
                ->where('permissions.is_active', true))
            ->exists();
    }

    public function hasPermissionForRole(string $permission, ?string $role): bool
    {
        if ($role === null || trim($role) === '') {
            return false;
        }

        $permission = Str::lower(trim($permission));
        $role = Str::lower(trim($role));

        return $this->roles()
            ->where('roles.name', $role)
            ->whereHas('permissions', fn ($query) => $query
                ->where('permissions.name', $permission)
                ->where('permissions.is_active', true))
            ->exists();
    }

    public function isBanned(): bool
    {
        return $this->banned_at !== null;
    }
}
