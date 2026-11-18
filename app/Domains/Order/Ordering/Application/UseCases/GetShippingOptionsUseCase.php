<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Addresses\Domain\Entities\Address;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Domain\Services\ShippingCostCalculator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Throwable;

final class GetShippingOptionsUseCase
{
    public function __construct(
        private AddressRepositoryInterface $addressRepository,
        private ProductForCartReaderInterface $productReader,
        private ShippingCostCalculator $shippingCalculator
    ) {}

    public function execute(string $userId, int $addressId, array $cartItemIds, ?array $items = null): array
    {
        $context = $items === null
            ? $this->buildCartContext($userId, $addressId, $cartItemIds)
            : $this->buildDirectContext($userId, $addressId, $items);

        try {
            $quote = $this->shippingCalculator->quote($context);
            $options = $quote['options'];
            $warnings = $quote['warnings'];
        } catch (Throwable $exception) {
            throw new RuntimeException($exception->getMessage());
        }

        $options = collect($options)
            ->map(fn (array $option): array => $option + ['price' => $option['cost']])
            ->sortBy('cost')
            ->values()
            ->all();

        if (! $options) {
            throw new RuntimeException($warnings[0] ?? 'Pengiriman belum tersedia. Pastikan koordinat toko dan alamat penerima sudah diisi.');
        }

        return [
            'options' => $options,
            'warnings' => collect($warnings)->filter()->unique()->values()->all(),
        ];
    }

    private function buildCartContext(string $userId, int $addressId, array $cartItemIds): array
    {
        $address = $this->resolveAddress($userId, $addressId);

        $cart = CartModel::where('user_id', $userId)->first();
        if (! $cart) {
            throw new RuntimeException('Keranjang belanja tidak ditemukan.');
        }

        $ids = collect($cartItemIds)->map(fn ($id) => (int) $id)->filter()->unique()->values();
        $selectedItems = $cart->items()->whereIn('id', $ids)->get();

        if ($selectedItems->count() !== $ids->count()) {
            throw new RuntimeException('Sebagian item checkout tidak ditemukan di keranjang Anda.');
        }

        $variantIds = $selectedItems->pluck('product_variant_id')->map(fn ($id) => (int) $id)->all();
        $detailsMap = $this->productReader->getVariantsDetails($variantIds);

        $context = $this->baseContext($address);
        foreach ($selectedItems as $item) {
            $details = $detailsMap[(int) $item->product_variant_id] ?? null;
            if (! $details) {
                throw new RuntimeException('Data varian produk tidak ditemukan.');
            }
            if ($details->getStock() < (int) $item->quantity) {
                throw new RuntimeException("Stok {$details->getProductName()} tidak mencukupi.");
            }

            $context['weight'] += $details->getWeight() * (int) $item->quantity;
            $context['item_value'] += $details->getPrice()->getAmount() * (int) $item->quantity;
        }

        return $context;
    }

    private function buildDirectContext(string $userId, int $addressId, array $items): array
    {
        $address = $this->resolveAddress($userId, $addressId);

        $quantities = [];
        foreach ($items as $line) {
            $variantId = (int) ($line['product_variant_id'] ?? 0);
            $quantity = (int) ($line['quantity'] ?? 0);
            if ($variantId > 0 && $quantity > 0) {
                $quantities[$variantId] = (int) ($quantities[$variantId] ?? 0) + $quantity;
            }
        }

        if ($quantities === []) {
            throw new RuntimeException('Pilih minimal satu produk untuk melakukan checkout.');
        }

        $variantIds = array_keys($quantities);
        $detailsMap = $this->productReader->getVariantsDetails($variantIds);

        if (count($detailsMap) !== count($variantIds)) {
            throw new RuntimeException('Beberapa produk tidak tersedia untuk dibeli.');
        }

        $context = $this->baseContext($address);
        foreach ($quantities as $variantId => $quantity) {
            $details = $detailsMap[(int) $variantId] ?? null;
            if (! $details) {
                throw new RuntimeException('Data varian produk tidak ditemukan.');
            }
            if ($details->getStock() < $quantity) {
                throw new RuntimeException("Stok {$details->getProductName()} tidak mencukupi.");
            }

            $context['weight'] += $details->getWeight() * $quantity;
            $context['item_value'] += $details->getPrice()->getAmount() * $quantity;
        }

        return $context;
    }

    private function resolveAddress(string $userId, int $addressId): Address
    {
        $address = $this->addressRepository->findByIdAndOwner($addressId, $userId);
        if (! $address) {
            throw new RuntimeException('Alamat pengiriman tidak ditemukan.');
        }

        return $address;
    }

    private function baseContext(Address $destination): array
    {
        $setting = $this->shippingSetting();

        return [
            'origin_latitude' => $this->firstCoordinate($setting?->store_latitude),
            'origin_longitude' => $this->firstCoordinate($setting?->store_longitude),
            'latitude' => $this->firstCoordinate($destination->latitude),
            'longitude' => $this->firstCoordinate($destination->longitude),
            'free_shipping_max_distance' => (float) ($setting?->free_shipping_max_distance ?? 0),
            'default_flat_rate' => (float) ($setting?->default_flat_rate ?? 0),
            'rate_per_km' => (float) ($setting?->rate_per_km ?? config('services.shipping.express_rate_per_km', 0)),
            'weight' => 0,
            'item_value' => 0,
        ];
    }

    private function shippingSetting(): ?object
    {
        // Tarif/koordinat ongkir jarang berubah: cache lintas-request agar
        // endpoint opsi pengiriman tidak membaca database pada setiap hit.
        return Cache::remember('shipping.settings', 3600, function (): ?object {
            try {
                if (! Schema::hasTable('shipping_settings')) {
                    return null;
                }

                return DB::table('shipping_settings')->orderBy('id')->first();
            } catch (Throwable) {
                return null;
            }
        });
    }

    private function firstCoordinate(mixed ...$values): ?float
    {
        foreach ($values as $value) {
            if (is_numeric($value)) {
                return (float) $value;
            }
        }

        return null;
    }
}
