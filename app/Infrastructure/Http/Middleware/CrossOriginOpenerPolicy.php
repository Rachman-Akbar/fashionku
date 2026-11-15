<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Izinkan popup lintas origin (mis. Firebase Auth Google sign-in popup)
 * untuk tetap dapat menutup dirinya sendiri agar kebijakan
 * Cross-Origin-Opener-Policy tidak memblokir panggilan window.close().
 */
final class CrossOriginOpenerPolicy
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

        return $response;
    }
}
