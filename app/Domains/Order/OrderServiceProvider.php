<?php

declare(strict_types=1);

namespace App\Domains\Order;

use App\Domains\Admin\AdminServiceProvider;
use App\Domains\Identity\IdentityServiceProvider;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use App\Domains\Order\Addresses\Domain\Services\DestinationResolverInterface;
use App\Domains\Order\Addresses\Infrastructure\Persistence\Repositories\EloquentAddressRepository;
use App\Domains\Order\Addresses\Infrastructure\Services\RajaOngkirDestinationResolver;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;
use App\Domains\Order\Cart\Infrastructure\Persistence\Readers\EloquentProductForCartReader;
use App\Domains\Order\Cart\Infrastructure\Persistence\Repositories\EloquentCartRepository;
use App\Domains\Order\Ordering\Domain\Repositories\OrderRepositoryInterface;
use App\Domains\Order\Ordering\Infrastructure\Persistence\Repositories\EloquentOrderRepository;
use App\Domains\Order\Payment\Domain\Repositories\PaymentRepositoryInterface;
use App\Domains\Order\Payment\Infrastructure\Persistence\Repositories\EloquentPaymentRepository;
use App\Domains\Order\Review\Application\Policies\ProductReviewPolicy;
use App\Domains\Order\Review\Domain\Repositories\ProductReviewRepositoryInterface;
use App\Domains\Order\Review\Infrastructure\Persistence\Models\ProductReviewModel;
use App\Domains\Order\Review\Infrastructure\Persistence\Repositories\EloquentProductReviewRepository;
use App\Domains\Order\Voucher\Domain\Repositories\UserVoucherRepositoryInterface;
use App\Domains\Order\Voucher\Domain\Repositories\VoucherRepositoryInterface;
use App\Domains\Order\Voucher\Infrastructure\Persistence\Repositories\EloquentUserVoucherRepository;
use App\Domains\Order\Voucher\Infrastructure\Persistence\Repositories\EloquentVoucherRepository;
use App\Domains\Order\Wishlist\Domain\Repositories\WishlistRepositoryInterface;
use App\Domains\Order\Wishlist\Infrastructure\Persistence\Repositories\EloquentWishlistRepository;
use App\Domains\Seller\SellerServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

final class OrderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->register(AdminServiceProvider::class);
        $this->app->register(IdentityServiceProvider::class);
        $this->app->register(SellerServiceProvider::class);
        $this->app->bind(CartRepositoryInterface::class, EloquentCartRepository::class);
        $this->app->bind(ProductForCartReaderInterface::class, EloquentProductForCartReader::class);
        $this->app->bind(AddressRepositoryInterface::class, EloquentAddressRepository::class);
        $this->app->bind(DestinationResolverInterface::class, RajaOngkirDestinationResolver::class);
        $this->app->bind(WishlistRepositoryInterface::class, EloquentWishlistRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, EloquentPaymentRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, EloquentOrderRepository::class);
        $this->app->bind(VoucherRepositoryInterface::class, EloquentVoucherRepository::class);
        $this->app->bind(UserVoucherRepositoryInterface::class, EloquentUserVoucherRepository::class);
        $this->app->bind(ProductReviewRepositoryInterface::class, EloquentProductReviewRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(ProductReviewModel::class, ProductReviewPolicy::class);
    }
}
