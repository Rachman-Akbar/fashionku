<?php

declare(strict_types=1);

namespace App\Domains;

use App\Domains\Admin\AdminServiceProvider;
use App\Domains\Catalog\CatalogServiceProvider;
use App\Domains\Communication\CommunicationServiceProvider;
use App\Domains\Identity\IdentityServiceProvider;
use App\Domains\Order\OrderServiceProvider;
use App\Domains\Seller\SellerServiceProvider;
use App\Domains\Support\SupportServiceProvider;
use Illuminate\Support\ServiceProvider;

final class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->register(IdentityServiceProvider::class);
        $this->app->register(AdminServiceProvider::class);
        $this->app->register(CatalogServiceProvider::class);
        $this->app->register(OrderServiceProvider::class);
        $this->app->register(SellerServiceProvider::class);
        $this->app->register(SupportServiceProvider::class);
        $this->app->register(CommunicationServiceProvider::class);
    }
}
