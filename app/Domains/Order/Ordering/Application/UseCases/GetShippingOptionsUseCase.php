<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Addresses\Application\UseCases\ResolveAddressDestinationUseCase;
use App\Domains\Order\Addresses\Domain\Entities\Address;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Domain\Services\ShippingCostCalculator;
use App\Domains\Shared\Settings\Application\Services\AppSettingService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Throwable;

final class GetShippingOptionsUseCase
{
    public function __construct(
        private AddressRepositoryInterface $addressRepository,
        private ProductForCartReaderInterface $productReader,
        private ShippingCostCalculator $shippingCalculator,
        private ResolveAddressDestinationUseCase $resolveDestinationUseCase
    ) {}

    public function execute(string $userId, int $addressId, array $cartItemIds, ?array $items = null): array
    {
        $context = $items === null
            ? $this->buildCartContext($userId, $addressId, $cartItemIds)
            : $this->buildDirectContext($userId, $addressId, $items);

        $warnings = [];

        try {
            $quote = $this->shippingCalculator->quote($context);
            $options = $quote['options'];
            $warnings = $quote['warnings'];
        } catch (Throwable $exception) {
            throw new RuntimeException($exception->getMessage());
        }

        $options = collect($options)
            ->map(function (array $option): array {
                $option['price'] = $option['cost'];

                return $option;
            })
            ->sortBy('cost')
            ->values()
            ->reject(fn (array $option): bool => $this->isPickupOption($option))
            ->values()
            ->all();

        if (! $options) {
            throw new RuntimeException($warnings[0] ?? 'Tidak ada layanan pengiriman yang tersedia.');
        }

        return [
            'options' => $options,
            'warnings' => collect($warnings)->filter()->unique()->values()->all(),
        ];
    }

    private function isPickupOption(array $option): bool
    {
        $courier = strtolower(trim((string) ($option['courier'] ?? '')));

        return $courier === 'ambil_sendiri'
            || $courier === 'pickup'
            || str_contains(strtolower(trim((string) ($option['id'] ?? ''))), 'ambil_sendiri')
            || strtolower(trim((string) ($option['provider'] ?? ''))) === 'pickup';
    }

    private function buildCartContext(string $userId, int $addressId, array $cartItemIds): array
    {
        $address = $this->resolveDestination($userId, $addressId);

        $cart = CartModel::where('user_id', $userId)->first();
        if (! $cart) {
            throw new RuntimeException('Keranjang belanja tidak ditemukan.');
        }

        $ids = collect($cartItemIds)
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values();
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
        $address = $this->resolveDestination($userId, $addressId);

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

    private function resolveDestination(string $userId, int $addressId): Address
    {
        $address = $this->addressRepository->findByIdAndOwner($addressId, $userId);
        if (! $address) {
            throw new RuntimeException('Alamat pengiriman tidak ditemukan.');
        }

        $this->refreshDestinationId($address);

        return $address;
    }

    private function baseContext(Address $destination): array
    {
        $setting = $this->shippingSetting();
        $profile = app(AppSettingService::class)->storeProfile();

        $originDestinationId = $this->firstText(
            $setting?->origin_destination_id,
            $profile['detail']['komerce_destination_id'] ?? null
        );

        return [
            'origin_destination_id' => $originDestinationId,
            'destination_id' => trim((string) $destination->komerce_destination_id),
            'origin_latitude' => $this->firstCoordinate($setting?->store_latitude),
            'origin_longitude' => $this->firstCoordinate($setting?->store_longitude),
            'latitude' => $this->firstCoordinate($destination->latitude),
            'longitude' => $this->firstCoordinate($destination->longitude),
            'free_shipping_max_distance' => (float) ($setting?->free_shipping_max_distance ?? 0),
            'default_flat_rate' => (float) ($setting?->default_flat_rate ?? 0),
            'rate_per_km' => (float) (
                $setting?->rate_per_km
                ?? config('services.shipping.express_rate_per_km', 0)
            ),
            'weight' => 0,
            'item_value' => 0,
            'allowed_couriers' => (array) config('services.shipping.allowed_couriers', []),
        ];
    }

    private function shippingSetting(): ?object
    {
        try {
            if (! Schema::hasTable('shipping_settings')) {
                return null;
            }

            return DB::table('shipping_settings')->orderBy('id')->first();
        } catch (Throwable) {
            return null;
        }
    }

    private function refreshDestinationId(Address $address): void
    {
        if (trim((string) $address->komerce_destination_id) !== '') {
            return;
        }

        try {
            $resolved = $this->resolveDestinationUseCase->execute([
                'country' => $address->country,
                'province' => $address->province,
                'city_or_regency' => $address->city_or_regency,
                'district' => $address->district,
                'subdistrict' => $address->subdistrict,
                'postal_code' => $address->postal_code,
            ]);

            $address->forceFill([
                'komerce_destination_id' => $resolved->id,
            ])->save();
        } catch (Throwable) {
        }
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

    private function firstText(mixed ...$values): string
    {
        foreach ($values as $value) {
            $text = trim((string) $value);

            if ($text !== '') {
                return $text;
            }
        }

        return '';
    }
}
