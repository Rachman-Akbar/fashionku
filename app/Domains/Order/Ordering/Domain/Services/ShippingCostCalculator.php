<?php

namespace App\Domains\Order\Ordering\Domain\Services;

use App\Domains\Order\Ordering\Infrastructure\Services\RajaOngkirShippingCalculator;
use InvalidArgumentException;
use Throwable;

class ShippingCostCalculator
{
    public function __construct(
        private ExpressShippingCalculator $expressCalculator,
        private RajaOngkirShippingCalculator $rajaOngkirCalculator
    ) {}

    public function calculate(string $courier, array $context, ?string $service = null): float
    {
        $courier = $this->normalizeCourier($courier);

        if ($courier === 'ambil_sendiri') {
            return 0.0;
        }

        if ($courier === 'haversine') {
            if (! $this->hasCompleteCoordinates($context)) {
                throw new InvalidArgumentException('Koordinat asal atau tujuan belum lengkap untuk menghitung ongkir Haversine.');
            }

            return $this->expressCalculator->calculate($context);
        }

        if (! $this->hasCompleteDestinationIds($context)) {
            throw new InvalidArgumentException(
                'RajaOngkir belum tersedia karena destination ID asal atau tujuan belum ditemukan.'
            );
        }

        return $this->rajaOngkirCalculator->calculate($context + [
            'courier' => $courier,
            'service' => $service,
        ]);
    }

    public function quote(array $context): array
    {
        $options = [];
        $warnings = [];

        if ($this->hasCompleteDestinationIds($context)) {
            try {
                foreach ($this->rajaOngkirCalculator->options($context) as $option) {
                    $options[] = $option + [
                        'provider' => 'rajaongkir',
                        'requires_destination_id' => true,
                    ];
                }
            } catch (Throwable $exception) {
                $warnings[] = 'RajaOngkir: '.$exception->getMessage();
            }
        } else {
            $warnings[] = 'RajaOngkir belum tersedia karena destination ID asal atau tujuan belum ditemukan.';
        }

        if ($this->hasCompleteCoordinates($context)) {
            try {
                $distance = $this->expressCalculator->distanceInKilometers(
                    (float) $context['origin_latitude'],
                    (float) $context['origin_longitude'],
                    (float) $context['latitude'],
                    (float) $context['longitude']
                );

                $options[] = [
                    'id' => 'haversine:internal',
                    'courier' => 'haversine',
                    'courier_label' => 'Haversine',
                    'service' => 'HAVERSINE',
                    'description' => 'Pengiriman berdasarkan jarak koordinat toko ke alamat penerima.',
                    'etd' => number_format($distance, 1, ',', '.').' km',
                    'cost' => $this->expressCalculator->calculate($context),
                    'provider' => 'haversine',
                    'requires_destination_id' => false,
                ];
            } catch (Throwable $exception) {
                $warnings[] = 'Haversine: '.$exception->getMessage();
            }
        } else {
            $warnings[] = 'Haversine belum tersedia karena koordinat toko atau alamat penerima belum lengkap.';
        }

        $options[] = [
            'id' => 'ambil_sendiri:pickup',
            'courier' => 'ambil_sendiri',
            'courier_label' => 'Ambil Sendiri',
            'service' => 'PICKUP',
            'description' => 'Ambil pesanan langsung di toko.',
            'etd' => '',
            'cost' => 0.0,
            'provider' => 'pickup',
            'requires_destination_id' => false,
        ];

        return [
            'options' => collect($options)->unique('id')->sortBy('cost')->values()->all(),
            'warnings' => collect($warnings)->filter()->unique()->values()->all(),
        ];
    }

    public function options(array $context): array
    {
        return $this->quote($context)['options'];
    }

    public function normalizeCourier(string $courier): string
    {
        $courier = strtolower(trim($courier));

        return match ($courier) {
            'pickup', 'ambil-sendiri', 'ambil sendiri' => 'ambil_sendiri',
            'express', 'internal', 'local', 'kurir_toko', 'store_delivery' => 'haversine',
            default => $courier,
        };
    }

    private function hasCompleteDestinationIds(array $context): bool
    {
        return trim((string) ($context['origin_destination_id'] ?? '')) !== ''
            && trim((string) ($context['destination_id'] ?? '')) !== '';
    }

    private function hasCompleteCoordinates(array $context): bool
    {
        $coordinates = [];

        foreach ([
            'origin_latitude',
            'origin_longitude',
            'latitude',
            'longitude',
        ] as $key) {
            if (! array_key_exists($key, $context) || ! is_numeric($context[$key])) {
                return false;
            }

            $coordinates[$key] = (float) $context[$key];
        }

        if (
            $coordinates['origin_latitude'] < -90
            || $coordinates['origin_latitude'] > 90
            || $coordinates['latitude'] < -90
            || $coordinates['latitude'] > 90
            || $coordinates['origin_longitude'] < -180
            || $coordinates['origin_longitude'] > 180
            || $coordinates['longitude'] < -180
            || $coordinates['longitude'] > 180
        ) {
            return false;
        }

        return ! (
            $coordinates['origin_latitude'] === 0.0
            && $coordinates['origin_longitude'] === 0.0
        ) && ! (
            $coordinates['latitude'] === 0.0
            && $coordinates['longitude'] === 0.0
        );
    }
}
