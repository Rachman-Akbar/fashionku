<?php

namespace App\Domains\Order\Ordering\Domain\Services;

use InvalidArgumentException;

class ExpressShippingCalculator implements ShippingCalculatorInterface
{
    public function calculate(array $data): float
    {
        foreach (['origin_latitude', 'origin_longitude', 'latitude', 'longitude'] as $key) {
            if (! isset($data[$key]) || ! is_numeric($data[$key])) {
                throw new InvalidArgumentException('Koordinat asal dan tujuan diperlukan untuk pengiriman express.');
            }
        }

        $distance = $this->distanceInKilometers(
            (float) $data['origin_latitude'],
            (float) $data['origin_longitude'],
            (float) $data['latitude'],
            (float) $data['longitude']
        );

        $freeDistance = max(0, (float) ($data['free_shipping_max_distance'] ?? 0));
        if ($distance <= $freeDistance) {
            return 0.0;
        }

        $flatRate = max(0, (float) ($data['default_flat_rate'] ?? 0));
        $ratePerKm = max(0, (float) ($data['rate_per_km'] ?? config('services.shipping.express_rate_per_km', 0)));
        $billableDistance = max(0, $distance - $freeDistance);

        return round($flatRate + ($billableDistance * $ratePerKm), 2);
    }

    public function distanceInKilometers(float $originLat, float $originLng, float $destinationLat, float $destinationLng): float
    {
        $earthRadius = 6371;
        $latDelta = deg2rad($destinationLat - $originLat);
        $lngDelta = deg2rad($destinationLng - $originLng);
        $a = sin($latDelta / 2) ** 2
            + cos(deg2rad($originLat)) * cos(deg2rad($destinationLat)) * sin($lngDelta / 2) ** 2;

        return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
