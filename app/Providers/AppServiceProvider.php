<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Observer User sebaiknya dipindah ke IdentityServiceProvider di method boot()
    }
}
