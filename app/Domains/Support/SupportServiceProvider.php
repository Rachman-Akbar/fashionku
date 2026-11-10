<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Domains\Support\Ticket\Application\Policies\TicketPolicy;
use App\Domains\Support\Ticket\Domain\Repositories\TicketRepositoryInterface;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketModel;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Repositories\EloquentTicketRepository;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class SupportServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TicketRepositoryInterface::class, EloquentTicketRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(SupportTicketModel::class, TicketPolicy::class);
    }
}
