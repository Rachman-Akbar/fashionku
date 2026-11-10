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
use App\Domains\Seller\Stores\Application\ReadModels\ProductCatalogReaderInterface;
use App\Domains\Seller\Stores\Application\ReadModels\StoreCatalogReaderInterface;
use App\Domains\Seller\Stores\Domain\Repositories\StoreRepositoryInterface;
use App\Domains\Seller\Stores\Infrastructure\Middleware\EnsureSellerStoreAvailable;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Repositories\EloquentStoreRepository;
use App\Domains\Seller\Stores\Infrastructure\ReadModels\EloquentProductCatalogReader;
use App\Domains\Seller\Stores\Infrastructure\ReadModels\Store\EloquentStoreCatalogReader;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class SellerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(StoreRepositoryInterface::class, EloquentStoreRepository::class);
        $this->app->bind(StoreCatalogReaderInterface::class, EloquentStoreCatalogReader::class);
        $this->app->bind(ProductCatalogReaderInterface::class, EloquentProductCatalogReader::class);
        $this->app->bind(CustomerRepositoryInterface::class, EloquentCustomerRepository::class);
        $this->app->bind(FinancialTransactionRepositoryInterface::class, EloquentFinancialTransactionRepository::class);
        $this->app->bind(StockMovementRepositoryInterface::class, EloquentStockMovementRepository::class);
    }

    public function boot(Router $router): void
    {
        $router->aliasMiddleware('seller.store.available', EnsureSellerStoreAvailable::class);
        Gate::policy(FinancialTransactionModel::class, FinancialTransactionPolicy::class);
        Gate::policy(StockMovementModel::class, StockMovementPolicy::class);
    }
}
