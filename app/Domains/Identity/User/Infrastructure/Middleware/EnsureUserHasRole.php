<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! (bool) $user->is_active || $user->banned_at !== null) {
            return response()->json(['message' => 'Akun tidak memiliki akses aktif.'], 403);
        }

        $allowedRoles = collect($roles)
            ->flatMap(fn (string $role): array => explode(',', $role))
            ->map(fn (string $role): string => strtolower(trim($role)))
            ->filter()
            ->unique()
            ->values();
        $token = $user->currentAccessToken();
        $activeRoleAbility = collect($token?->abilities ?? [])
            ->first(fn (mixed $ability): bool => is_string($ability) && str_starts_with($ability, 'active-role:'));
        $activeRole = is_string($activeRoleAbility)
            ? substr($activeRoleAbility, strlen('active-role:'))
            : null;
        $authorized = $allowedRoles->contains(
            fn (string $role): bool => $user->hasRole($role) && $activeRole === $role
        );

        if (! $authorized) {
            return response()->json(['message' => 'Insufficient active role access.'], 403);
        }

        $request->attributes->set('active_role', $activeRole);

        return $next($request);
    }
}
