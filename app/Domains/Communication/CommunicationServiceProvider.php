<?php

declare(strict_types=1);

namespace App\Domains\Communication;

use App\Domains\Admin\AdminServiceProvider;
use App\Domains\Communication\Chat\Application\Policies\ConversationPolicy;
use App\Domains\Communication\Chat\Domain\Repositories\ConversationRepositoryInterface;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Repositories\EloquentConversationRepository;
use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Routing\Route as IlluminateRoute;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class CommunicationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if ($this->app->getProviders(AdminServiceProvider::class) === []) {
            $this->app->register(AdminServiceProvider::class);
        }

        $this->app->bind(ConversationRepositoryInterface::class, EloquentConversationRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(ConversationModel::class, ConversationPolicy::class);

        $this->registerHttpRoutes();
        $this->registerBroadcastAuthRoute();
        $this->registerBroadcastChannels();
    }

    private function registerHttpRoutes(): void
    {
        if ($this->app->routesAreCached() || $this->hasRoute('POST', 'api/v1/communication/conversations')) {
            return;
        }

        Route::middleware('api')
            ->prefix('api/v1')
            ->group(app_path('Domains/Communication/routes.php'));
    }

    private function registerBroadcastAuthRoute(): void
    {
        if ($this->app->routesAreCached() || $this->hasRoute('POST', 'api/broadcasting/auth')) {
            return;
        }

        Broadcast::routes([
            'prefix' => 'api',
            'middleware' => ['auth:sanctum', 'active.user', 'verified.email'],
        ]);
    }

    private function registerBroadcastChannels(): void
    {
        Broadcast::channel('chat.user.{userId}', function (User $user, string $userId): bool {
            return (string) $user->id === $userId;
        });

        Broadcast::channel('conversation.{conversationId}', function (User $user, int $conversationId): bool {
            $activeRole = collect($user->currentAccessToken()?->abilities ?? [])
                ->first(fn (mixed $ability): bool => is_string($ability) && str_starts_with($ability, 'active-role:'));

            if ($activeRole === 'active-role:admin' && ($user->hasRole('admin') || $user->hasRole('super_admin'))) {
                return true;
            }

            return DB::table('conversation_participants')
                ->where('conversation_id', $conversationId)
                ->where('user_id', $user->id)
                ->whereNull('left_at')
                ->exists();
        });
    }

    private function hasRoute(string $method, string $uri): bool
    {
        return collect(Route::getRoutes()->getRoutes())->contains(
            fn (IlluminateRoute $route): bool => $route->uri() === $uri && in_array($method, $route->methods(), true)
        );
    }
}
