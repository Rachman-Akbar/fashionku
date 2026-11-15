<?php

namespace App\Domains\Order\Ordering\Domain\Services;

use InvalidArgumentException;
use Throwable;

class ShippingCostCalculator
{
    public function __construct(private ExpressShippingCalculator $expressCalculator) {}

    public function calculate(string $courier, array $context, ?string $service = null): float
    {
        $courier = $this->normalizeCourier($courier);

        if ($courier === 'ambil_sendiri') {
            return 0.0;
        }

        if ($courier === 'haversine') {
            if (! $this->hasCompleteCoordinates($context)) {
                throw new InvalidArgumentException('Koordinat asal atau tujuan belum lengkap untuk menghitung ongkir.');
            }

            return $this->expressCalculator->calculate($context);
        }

        throw new InvalidArgumentException('Layanan pengiriman tidak didukung. Gunakan Haversine.');
    }

    public function quote(array $context): array
    {
        $options = [];
        $warnings = [];

        if ($this->hasCompleteCoordinates($context)) {
            try {
                $distance = $this->expressCalculator->distanceInKilometers(
                    (float) $context['origin_latitude'],
                    (float) $context['origin_longitude'],
                    (float) $context['latitude'],
                    (float) $context['longitude']
                );

                $options[] = [
                    'id' => 'haversine:delivery',
                    'courier' => 'haversine',
                    'courier_label' => 'Pengiriman Haversine',
                    'service' => 'HAVERSINE',
                    'description' => 'Ongkir dihitung dari jarak toko ke alamat penerima.',
                    'etd' => number_format($distance, 1, ',', '.').' km',
                    'cost' => $this->expressCalculator->calculate($context),
                    'provider' => 'haversine',
                    'requires_destination_id' => false,
                ];
            } catch (Throwable $exception) {
                $warnings[] = $exception->getMessage();
            }
        } else {
            $warnings[] = 'Pengiriman belum tersedia karena koordinat toko atau alamat penerima belum lengkap.';
        }

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
            'pickup', 'ambil-sendiri', 'ambil sendiri', 'ambil_sendiri' => 'ambil_sendiri',
            'express', 'internal', 'local', 'kurir_toko', 'store_delivery', 'haversine' => 'haversine',
            default => 'haversine',
        };
    }

    private function hasCompleteCoordinates(array $context): bool
    {
        $coordinates = [];

        foreach (['origin_latitude', 'origin_longitude', 'latitude', 'longitude'] as $key) {
            if (! array_key_exists($key, $context) || ! is_numeric($context[$key])) {
                return false;
            }

            $coordinates[$key] = (float) $context[$key];
        }

        if (
            $coordinates['origin_latitude'] < -90 || $coordinates['origin_latitude'] > 90
            || $coordinates['latitude'] < -90 || $coordinates['latitude'] > 90
            || $coordinates['origin_longitude'] < -180 || $coordinates['origin_longitude'] > 180
            || $coordinates['longitude'] < -180 || $coordinates['longitude'] > 180
        ) {
            return false;
        }

        return ! ($coordinates['origin_latitude'] === 0.0 && $coordinates['origin_longitude'] === 0.0)
            && ! ($coordinates['latitude'] === 0.0 && $coordinates['longitude'] === 0.0);
    }
}
