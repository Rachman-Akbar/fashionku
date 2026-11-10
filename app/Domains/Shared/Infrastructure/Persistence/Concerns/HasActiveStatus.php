<?php

declare(strict_types=1);

namespace App\Domains\Shared\Infrastructure\Persistence\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait HasActiveStatus
{
    public function scopeActive(Builder $query): Builder
    {
        return $query->where($this->qualifyColumn('is_active'), true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where($this->qualifyColumn('is_active'), false);
    }
}
