<?php

declare(strict_types=1);

namespace App\Domains\Shared\Infrastructure\Persistence\Concerns;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Mengisi `created_by` / `updated_by` otomatis dan menyediakan relasi ke
 * user pembuat/pengubah supaya kolom audit tersebut bisa ditampilkan
 * sebagai nama (bukan UUID) di halaman data admin.
 */
trait TracksUserChanges
{
    protected static function bootTracksUserChanges(): void
    {
        static::creating(function ($model): void {
            $userId = auth()->id();

            if ($userId !== null) {
                $model->created_by ??= $userId;
                $model->updated_by ??= $userId;
            }
        });

        static::updating(function ($model): void {
            $userId = auth()->id();

            if ($userId !== null) {
                $model->updated_by = $userId;
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
