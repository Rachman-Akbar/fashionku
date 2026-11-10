<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureActiveUser
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (! (bool) $user->is_active) {
            return response()->json(['message' => 'Akun sedang nonaktif.'], 403);
        }

        if ($user->banned_at !== null) {
            return response()->json(['message' => 'Akun sedang diblokir.'], 403);
        }

        return $next($request);
    }
}
