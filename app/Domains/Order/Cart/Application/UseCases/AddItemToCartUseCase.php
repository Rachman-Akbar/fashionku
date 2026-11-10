<?php

declare(strict_types=1);

namespace App\Domains\Order\Cart\Application\UseCases;

use App\Domains\Order\Cart\Application\DTOs\AddCartItemData;
use App\Domains\Order\Cart\Application\DTOs\CartSummaryData;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
// PASTIKAN BARIS INI SEPERTI DI BAWAH INI:
use App\Domains\Order\Cart\Domain\Repositories\CartRepositoryInterface;
use DomainException;

final class AddItemToCartUseCase
{
    public function __construct(
        private CartRepositoryInterface $cartRepository,
        private ProductForCartReaderInterface $productReader
    ) {}

    public function execute(AddCartItemData $data): CartSummaryData
    {

        // 1. Ambil atau buat data keranjang belanja user
        $cart = $this->cartRepository->findByUserId($data->userId);
        if (! $cart) {
            $cart = $this->cartRepository->createNewCart($data->userId);
        }

        // 2. Cek stok varian produk dari Domain Produk (via Interface Reader)
        $variantStock = $this->productReader->getVariantStock($data->productVariantId);
        if ($variantStock === null) {
            throw new DomainException('Varian produk tidak ditemukan.');
        }

        // 3. Masukkan ke Domain Agregat Cart untuk diproses validasi internalnya
        $cart->addItem($data->productVariantId, $data->quantity, $variantStock);

        // 4. Simpan perubahan ke database
        $this->cartRepository->save($cart);

        // 5. Kembalikan data kalkulasi terbaru
        return $this->cartRepository->getSummary($cart->getUserId());
    }
}
