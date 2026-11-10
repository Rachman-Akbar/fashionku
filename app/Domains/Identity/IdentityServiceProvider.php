<?php

declare(strict_types=1);

namespace App\Domains\Identity;

use App\Domains\Identity\Auth\Infrastructure\Middleware\FirebaseTokenVerifier;
use App\Domains\Identity\User\Domain\Repositories\RoleRepositoryInterface;
use App\Domains\Identity\User\Domain\Repositories\UserRepositoryInterface;
use App\Domains\Identity\User\Infrastructure\Middleware\EnsureActiveRole;
use App\Domains\Identity\User\Infrastructure\Middleware\EnsureActiveUser;
use App\Domains\Identity\User\Infrastructure\Middleware\EnsureEmailIsVerified;
use App\Domains\Identity\User\Infrastructure\Middleware\EnsureUserHasPermission;
use App\Domains\Identity\User\Infrastructure\Middleware\EnsureUserHasRole;
use App\Domains\Identity\User\Infrastructure\Persistence\Repositories\EloquentRoleRepository;
use App\Domains\Identity\User\Infrastructure\Persistence\Repositories\EloquentUserRepository;
use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use RuntimeException;

final class IdentityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, EloquentRoleRepository::class);

        $this->app->singleton(FirebaseTokenVerifier::class, function (): FirebaseTokenVerifier {
            $configuredPath = trim((string) env('FIREBASE_CREDENTIALS', ''));

            if ($configuredPath === '') {
                throw new RuntimeException('FIREBASE_CREDENTIALS belum dikonfigurasi.');
            }

            $isAbsolute = str_starts_with($configuredPath, DIRECTORY_SEPARATOR)
                || preg_match('/^[A-Za-z]:[\\\\\/]/', $configuredPath) === 1;
            $credentialsPath = $isAbsolute ? $configuredPath : base_path($configuredPath);

            if (! is_file($credentialsPath) || ! is_readable($credentialsPath)) {
                throw new RuntimeException('File Firebase credentials tidak ditemukan atau tidak dapat dibaca.');
            }

            $firebaseAuth = (new Factory)
                ->withServiceAccount($credentialsPath)
                ->createAuth();

            return new FirebaseTokenVerifier($firebaseAuth);
        });
    }

    public function boot(Router $router): void
    {
        $router->aliasMiddleware('active.user', EnsureActiveUser::class);
        $router->aliasMiddleware('active.role', EnsureActiveRole::class);
        $router->aliasMiddleware('role', EnsureUserHasRole::class);
        $router->aliasMiddleware('permission', EnsureUserHasPermission::class);
        $router->aliasMiddleware('verified.email', EnsureEmailIsVerified::class);
    }
}
