<?php

declare(strict_types=1);

namespace App\Domains\Shared\Infrastructure\Persistence\Concerns;

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
}
