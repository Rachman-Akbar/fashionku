<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $allowed = collect($permissions)
            ->flatMap(fn (string $permission): array => explode(',', $permission))
            ->map(fn (string $permission): string => strtolower(trim($permission)))
            ->filter()
            ->unique()
            ->values();
        $activeRole = $this->activeRole($request);
        $authorized = $allowed->contains(
            fn (string $permission): bool => $user->hasPermissionForRole($permission, $activeRole)
        );

        if (! $authorized) {
            return response()->json(['message' => 'Insufficient permission access.'], 403);
        }

        return $next($request);
    }

    private function activeRole(Request $request): ?string
    {
        $attribute = $request->attributes->get('active_role');

        if (is_string($attribute) && $attribute !== '') {
            return strtolower(trim($attribute));
        }

        $ability = collect($request->user()?->currentAccessToken()?->abilities ?? [])
            ->first(fn (mixed $value): bool => is_string($value) && str_starts_with($value, 'active-role:'));

        return is_string($ability)
            ? strtolower(trim(substr($ability, strlen('active-role:'))))
            : null;
    }
}
