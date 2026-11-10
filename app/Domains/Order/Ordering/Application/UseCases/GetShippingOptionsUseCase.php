<?php

declare(strict_types=1);

namespace App\Domains\Order\Ordering\Application\UseCases;

use App\Domains\Order\Addresses\Application\UseCases\ResolveAddressDestinationUseCase;
use App\Domains\Order\Addresses\Domain\Entities\Address;
use App\Domains\Order\Addresses\Domain\Repositories\AddressRepositoryInterface;
use App\Domains\Order\Cart\Application\Readers\ProductForCartReaderInterface;
use App\Domains\Order\Cart\Infrastructure\Persistence\Models\CartModel;
use App\Domains\Order\Ordering\Domain\Services\ShippingCostCalculator;
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
        $contexts = $items === null
            ? $this->buildStoreContexts($userId, $addressId, $cartItemIds)
            : $this->buildDirectStoreContexts($userId, $addressId, $items);
        $aggregated = [];
        $warnings = [];

        foreach ($contexts as $storeId => $context) {
            try {
                $quote = $this->shippingCalculator->quote($context);
                $storeOptions = $quote['options'];

                foreach ($quote['warnings'] as $warning) {
                    $warnings[] = "Toko {$context['store_name']}: {$warning}";
                }
            } catch (Throwable $exception) {
                $warnings[] = "Toko {$context['store_name']}: {$exception->getMessage()}";

                continue;
            }

            foreach ($storeOptions as $option) {
                $id = (string) $option['id'];

                if (! isset($aggregated[$id])) {
                    $aggregated[$id] = array_merge($option, [
                        'cost' => 0.0,
                        'store_breakdown' => [],
                        'stores_available' => 0,
                    ]);
                }

                $aggregated[$id]['cost'] += (float) $option['cost'];
                $aggregated[$id]['stores_available']++;
                $aggregated[$id]['store_breakdown'][] = [
                    'store_id' => (int) $storeId,
                    'store_name' => $context['store_name'],
                    'weight' => $context['weight'],
                    'cost' => (float) $option['cost'],
                ];
            }
        }

        $storeCount = count($contexts);
        $options = collect($aggregated)
            ->filter(fn (array $option): bool => (int) $option['stores_available'] === $storeCount)
            ->map(function (array $option): array {
                unset($option['stores_available']);
                $option['price'] = $option['cost'];

                return $option;
            })
            ->sortBy('cost')
            ->values()
            ->reject(fn (array $option): bool => $this->isPickupOption($option))
            ->values()
            ->all();

        if (! $options) {
            throw new RuntimeException($warnings[0] ?? 'Tidak ada layanan pengiriman yang tersedia untuk semua toko.');
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

    public function buildStoreContexts(string $userId, int $addressId, array $cartItemIds): array
    {
        $address = $this->addressRepository->findByIdAndOwner($addressId, $userId, null);
        if (! $address) {
            throw new RuntimeException('Alamat pengiriman tidak ditemukan.');
        }

        $this->refreshDestinationId($address);

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

        $contexts = [];

        $variantIds = $selectedItems->pluck('product_variant_id')->map(fn ($id) => (int) $id)->all();
        $detailsMap = $this->productReader->getVariantsDetails($variantIds);

        foreach ($selectedItems as $item) {
            $details = $detailsMap[(int) $item->product_variant_id] ?? null;

            if (! $details) {
                throw new RuntimeException('Data varian produk tidak ditemukan.');
            }

            if ($details->getStock() < (int) $item->quantity) {
                throw new RuntimeException("Stok {$details->getProductName()} tidak mencukupi.");
            }

            $storeId = $details->getStoreId();

            if (! isset($contexts[$storeId])) {
                $contexts[$storeId] = $this->storeContext($storeId, $details->getStoreName(), $address);
            }

            $contexts[$storeId]['weight'] += $details->getWeight() * (int) $item->quantity;
            $contexts[$storeId]['item_value'] += $details->getPrice()->getAmount() * (int) $item->quantity;
        }

        return $contexts;
    }

    public function buildDirectStoreContexts(string $userId, int $addressId, array $items): array
    {
        $address = $this->addressRepository->findByIdAndOwner($addressId, $userId, null);
        if (! $address) {
            throw new RuntimeException('Alamat pengiriman tidak ditemukan.');
        }

        $this->refreshDestinationId($address);

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

        $contexts = [];

        foreach ($quantities as $variantId => $quantity) {
            $details = $detailsMap[(int) $variantId] ?? null;

            if (! $details) {
                throw new RuntimeException('Data varian produk tidak ditemukan.');
            }

            if ($details->getStock() < $quantity) {
                throw new RuntimeException("Stok {$details->getProductName()} tidak mencukupi.");
            }

            $storeId = $details->getStoreId();

            if (! isset($contexts[$storeId])) {
                $contexts[$storeId] = $this->storeContext($storeId, $details->getStoreName(), $address);
            }

            $contexts[$storeId]['weight'] += $details->getWeight() * $quantity;
            $contexts[$storeId]['item_value'] += $details->getPrice()->getAmount() * $quantity;
        }

        return $contexts;
    }

    private function storeContext(int $storeId, string $storeName, Address $destination): array
    {
        $originAddress = Address::query()
            ->where('store_id', (string) $storeId)
            ->orderByDesc('is_primary')
            ->orderBy('id')
            ->first();

        if ($originAddress) {
            $this->refreshDestinationId($originAddress);
        }

        $setting = $this->shippingSetting($storeId);
        $storeLocation = $this->storeLocation($storeId);
        $originLatitude = $this->firstCoordinate(
            $setting?->store_latitude,
            $originAddress?->latitude,
            $storeLocation['latitude'] ?? null,
            $storeLocation['store_latitude'] ?? null,
            $storeLocation['address_latitude'] ?? null,
            $storeLocation['lat'] ?? null
        );
        $originLongitude = $this->firstCoordinate(
            $setting?->store_longitude,
            $originAddress?->longitude,
            $storeLocation['longitude'] ?? null,
            $storeLocation['store_longitude'] ?? null,
            $storeLocation['address_longitude'] ?? null,
            $storeLocation['lng'] ?? null,
            $storeLocation['lon'] ?? null
        );
        $originDestinationId = $this->firstText(
            $originAddress?->komerce_destination_id,
            $storeLocation['komerce_destination_id'] ?? null,
            $storeLocation['destination_id'] ?? null
        );

        if ($originDestinationId === '') {
            $originDestinationId = $this->resolveStoreDestinationId($storeLocation);
        }

        return [
            'store_id' => $storeId,
            'store_name' => $storeName,
            'origin_destination_id' => $originDestinationId,
            'destination_id' => trim((string) $destination->komerce_destination_id),
            'origin_latitude' => $originLatitude,
            'origin_longitude' => $originLongitude,
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

    private function shippingSetting(int $storeId): ?object
    {
        try {
            if (! Schema::hasTable('shipping_settings')) {
                return null;
            }

            return DB::table('shipping_settings')->where('store_id', $storeId)->first();
        } catch (Throwable) {
            return null;
        }
    }

    private function storeLocation(int $storeId): array
    {
        try {
            if (! Schema::hasTable('stores')) {
                return [];
            }

            $available = Schema::getColumnListing('stores');
            $columns = collect([
                'latitude',
                'longitude',
                'store_latitude',
                'store_longitude',
                'address_latitude',
                'address_longitude',
                'lat',
                'lng',
                'lon',
                'komerce_destination_id',
                'destination_id',
                'country',
                'province',
                'city_or_regency',
                'city',
                'district',
                'subdistrict',
                'postal_code',
            ])->filter(fn (string $column): bool => in_array($column, $available, true))->values()->all();

            if (! $columns) {
                return [];
            }

            $row = DB::table('stores')->where('id', $storeId)->first($columns);

            return $row ? (array) $row : [];
        } catch (Throwable) {
            return [];
        }
    }

    private function resolveStoreDestinationId(array $storeLocation): string
    {
        $province = $this->firstText($storeLocation['province'] ?? null);
        $cityOrRegency = $this->firstText(
            $storeLocation['city_or_regency'] ?? null,
            $storeLocation['city'] ?? null
        );
        $district = $this->firstText($storeLocation['district'] ?? null);
        $subdistrict = $this->firstText($storeLocation['subdistrict'] ?? null);

        if ($province === '' || $cityOrRegency === '' || $district === '' || $subdistrict === '') {
            return '';
        }

        try {
            return $this->resolveDestinationUseCase->execute([
                'country' => $this->firstText($storeLocation['country'] ?? null, 'Indonesia'),
                'province' => $province,
                'city_or_regency' => $cityOrRegency,
                'district' => $district,
                'subdistrict' => $subdistrict,
                'postal_code' => $this->firstText($storeLocation['postal_code'] ?? null),
            ])->id;
        } catch (Throwable) {
            return '';
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
