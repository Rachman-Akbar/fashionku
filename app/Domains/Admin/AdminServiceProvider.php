<?php

declare(strict_types=1);

namespace App\Domains\Admin;

use App\Domains\Admin\Notification\Domain\Repositories\AdminNotificationRepositoryInterface;
use App\Domains\Admin\Notification\Infrastructure\Persistence\Repositories\EloquentAdminNotificationRepository;
use Illuminate\Support\ServiceProvider;

final class AdminServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AdminNotificationRepositoryInterface::class, EloquentAdminNotificationRepository::class);
    }

    public function boot(): void
    {
    }
}
