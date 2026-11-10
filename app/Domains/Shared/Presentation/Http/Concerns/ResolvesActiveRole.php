<?php

declare(strict_types=1);

namespace App\Domains\Shared\Presentation\Http\Concerns;

use Illuminate\Http\Request;

trait ResolvesActiveRole
{
    private function activeRole(Request $request): ?string
    {
        $role = $request->attributes->get('active_role');

        if (is_string($role) && $role !== '') {
            return strtolower(trim($role));
        }

        $ability = collect($request->user()?->currentAccessToken()?->abilities ?? [])
            ->first(fn (mixed $value): bool => is_string($value) && str_starts_with($value, 'active-role:'));

        return is_string($ability)
            ? strtolower(trim(substr($ability, strlen('active-role:'))))
            : null;
    }

    private function hasActiveRole(Request $request, string $role): bool
    {
        return $this->activeRole($request) === strtolower(trim($role));
    }
}
