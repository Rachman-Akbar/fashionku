<?php

declare(strict_types=1);

namespace App\Domains\Catalog;

use App\Domains\Catalog\Banner\Domain\Repositories\BannerRepositoryInterface;
use App\Domains\Catalog\Banner\Infrastructure\Persistence\Repositories\EloquentBannerRepository;
use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;
use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Repositories\EloquentCatalogGroupRepository;
use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Repositories\EloquentCategoryRepository;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductAttributeValueRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductImageRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductRepositoryInterface;
use App\Domains\Catalog\Product\Domain\Repositories\ProductVariantRepositoryInterface;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories\EloquentProductAttributeRepository;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories\EloquentProductAttributeValueRepository;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories\EloquentProductImageRepository;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories\EloquentProductRepository;
use App\Domains\Catalog\Product\Infrastructure\Persistence\Repositories\EloquentProductVariantRepository;
use App\Domains\Catalog\Promotion\Application\Policies\PromotionPaymentPolicy;
use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionPaymentRepositoryInterface;
use App\Domains\Catalog\Promotion\Domain\Repositories\PromotionRepositoryInterface;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Models\PromotionPaymentModel;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Repositories\EloquentPromotionPaymentRepository;
use App\Domains\Catalog\Promotion\Infrastructure\Persistence\Repositories\EloquentPromotionRepository;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class CatalogServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(
            __DIR__.'/Product/Infrastructure/Persistence/Migrations'
        );
        Gate::policy(PromotionPaymentModel::class, PromotionPaymentPolicy::class);
    }

    public function register(): void
    {
        $this->app->bind(CatalogGroupRepositoryInterface::class, EloquentCatalogGroupRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, EloquentCategoryRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(ProductImageRepositoryInterface::class, EloquentProductImageRepository::class);
        $this->app->bind(ProductAttributeRepositoryInterface::class, EloquentProductAttributeRepository::class);
        $this->app->bind(ProductAttributeValueRepositoryInterface::class, EloquentProductAttributeValueRepository::class);
        $this->app->bind(ProductVariantRepositoryInterface::class, EloquentProductVariantRepository::class);
        $this->app->bind(PromotionRepositoryInterface::class, EloquentPromotionRepository::class);
        $this->app->bind(PromotionPaymentRepositoryInterface::class, EloquentPromotionPaymentRepository::class);
        $this->app->bind(BannerRepositoryInterface::class, EloquentBannerRepository::class);
    }
}
