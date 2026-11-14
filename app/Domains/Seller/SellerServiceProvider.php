<?php

declare(strict_types=1);

namespace App\Domains\Seller;

use App\Domains\Seller\Customers\Domain\Repositories\CustomerRepositoryInterface;
use App\Domains\Seller\Customers\Infrastructure\Persistence\Repositories\EloquentCustomerRepository;
use App\Domains\Seller\Finance\Application\Policies\FinancialTransactionPolicy;
use App\Domains\Seller\Finance\Domain\Repositories\FinancialTransactionRepositoryInterface;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Models\FinancialTransactionModel;
use App\Domains\Seller\Finance\Infrastructure\Persistence\Repositories\EloquentFinancialTransactionRepository;
use App\Domains\Seller\Stock\Application\Policies\StockMovementPolicy;
use App\Domains\Seller\Stock\Domain\Repositories\StockMovementRepositoryInterface;
use App\Domains\Seller\Stock\Infrastructure\Persistence\Models\StockMovementModel;
use App\Domains\Seller\Stock\Infrastructure\Persistence\Repositories\EloquentStockMovementRepository;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class SellerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CustomerRepositoryInterface::class, EloquentCustomerRepository::class);
        $this->app->bind(FinancialTransactionRepositoryInterface::class, EloquentFinancialTransactionRepository::class);
        $this->app->bind(StockMovementRepositoryInterface::class, EloquentStockMovementRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(FinancialTransactionModel::class, FinancialTransactionPolicy::class);
        Gate::policy(StockMovementModel::class, StockMovementPolicy::class);
    }
}
