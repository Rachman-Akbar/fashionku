<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! (bool) $user->is_active || $user->banned_at !== null) {
            return response()->json(['message' => 'Akun tidak memiliki akses aktif.'], 403);
        }

        if (! (bool) $user->is_email_verified) {
            return response()->json(['message' => 'Email verification required.'], 403);
        }

        return $next($request);
    }
}
