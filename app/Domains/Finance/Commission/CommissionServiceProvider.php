<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission;

use App\Domains\Finance\Commission\Application\Services\AdminFeeConfigService;
use App\Domains\Finance\Commission\Application\Services\OrderCommissionService;
use App\Domains\Finance\Commission\Application\Services\SellerSettlementService;
use App\Domains\Finance\Commission\Application\Services\SellerWithdrawalService;
use App\Domains\Finance\Commission\Application\UseCases\CalculateCommissionUseCase;
use App\Domains\Finance\Commission\Domain\Repositories\AdminFeeConfigRepositoryInterface;
use App\Domains\Finance\Commission\Domain\Repositories\SellerSettlementRepositoryInterface;
use App\Domains\Finance\Commission\Domain\Repositories\SellerWithdrawalRepositoryInterface;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Repositories\EloquentAdminFeeConfigRepository;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Repositories\EloquentSellerSettlementRepository;
use App\Domains\Finance\Commission\Infrastructure\Persistence\Repositories\EloquentSellerWithdrawalRepository;
use Illuminate\Support\ServiceProvider;

class CommissionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AdminFeeConfigRepositoryInterface::class, EloquentAdminFeeConfigRepository::class);
        $this->app->bind(SellerSettlementRepositoryInterface::class, EloquentSellerSettlementRepository::class);
        $this->app->bind(SellerWithdrawalRepositoryInterface::class, EloquentSellerWithdrawalRepository::class);

        $this->app->singleton(AdminFeeConfigService::class);
        $this->app->singleton(SellerSettlementService::class);
        $this->app->singleton(SellerWithdrawalService::class);
        $this->app->singleton(OrderCommissionService::class);
        $this->app->singleton(CalculateCommissionUseCase::class);
    }

    public function boot(): void
    {
        //
    }
}
