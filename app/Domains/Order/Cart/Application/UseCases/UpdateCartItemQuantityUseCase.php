<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\UseCases;

use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Application\DTOs\UpdateCartItemData;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;
use DomainException;

final class UpdateCartItemQuantityUseCase
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private ProductForCartReaderInterface $productReader
    ) {}

    public function execute(UpdateCartItemData $data): CartSummaryData
    {
        $cart = $this->cartRepository->findByUserId($data->userId);
        if (! $cart) {
            throw new DomainException('Keranjang belanja tidak ditemukan.');
        }

        $variantStock = $this->productReader->getVariantStock($data->productVariantId);
        if ($variantStock === null) {
            throw new DomainException('Varian produk tidak ditemukan.');
        }

        if ($data->quantity > $variantStock) {
            throw new DomainException('Stok tidak mencukupi untuk kuantitas yang diminta.');
        }

        // Cari item di dalam agregat dan ubah jumlahnya
        foreach ($cart->getItems() as $item) {
            if ($item->getProductVariantId() === $data->productVariantId) {
                $item->changeQuantity($data->quantity);
                break;
            }
        }

        $this->cartRepository->save($cart);

        return $this->cartRepository->getSummary($data->userId);
    }
}
