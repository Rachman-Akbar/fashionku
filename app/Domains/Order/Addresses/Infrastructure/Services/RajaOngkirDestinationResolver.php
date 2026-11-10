<?php

declare(strict_types=1);

namespace App\Domains\Order\Addresses\Infrastructure\Services;

use App\Domains\Order\Addresses\Domain\Services\DestinationResolverInterface;
use App\Domains\Order\Addresses\Domain\ValueObjects\ResolvedDestination;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

final class RajaOngkirDestinationResolver implements DestinationResolverInterface
{
    public function resolve(array $address): ResolvedDestination
    {
        $target = $this->normalizeAddress($address);
        $this->validateTarget($target);

        $cacheKey = 'rajaongkir:destination:'.hash(
            'sha256',
            json_encode($target, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
        $ttl = max(
            60,
            (int) config('services.shipping.destination_cache_ttl', 2592000)
        );

        $resolved = Cache::remember(
            $cacheKey,
            $ttl,
            function () use ($target): array {
                $candidates = $this->searchCandidates($target);
                $matched = $this->selectBestCandidate($candidates, $target);

                if ($matched === null) {
                    throw new RuntimeException(
                        'Tujuan logistik RajaOngkir tidak cocok dengan detail alamat. Pastikan kelurahan, kecamatan, kota/kabupaten, dan kode pos benar.'
                    );
                }

                return $matched;
            }
        );

        return new ResolvedDestination(
            id: (string) $resolved['id'],
            label: (string) ($resolved['label'] ?? ''),
            province: (string) ($resolved['province_name'] ?? ''),
            cityOrRegency: (string) ($resolved['city_name'] ?? ''),
            district: (string) ($resolved['district_name'] ?? ''),
            subdistrict: (string) ($resolved['subdistrict_name'] ?? ''),
            postalCode: (string) ($resolved['zip_code'] ?? '')
        );
    }

    private function searchCandidates(array $target): array
    {
        $apiKey = trim((string) config('services.shipping.key'));

        if ($apiKey === '') {
            throw new RuntimeException('API key RajaOngkir belum dikonfigurasi.');
        }

        $candidates = [];
        $lastMessage = '';

        foreach ($this->buildSearchQueries($target) as $search) {
            $response = $this->client($apiKey)->get(
                $this->destinationUrl(),
                [
                    'search' => $search,
                    'limit' => 100,
                    'offset' => 0,
                ]
            );

            if ($response->failed()) {
                $lastMessage = (string) (
                    $response->json('meta.message')
                    ?? $response->json('message')
                    ?? 'RajaOngkir gagal mencari tujuan logistik.'
                );

                continue;
            }

            $rows = $response->json('data');

            if (! is_array($rows)) {
                continue;
            }

            foreach ($rows as $row) {
                if (! is_array($row) || ! isset($row['id'])) {
                    continue;
                }

                $candidates[(string) $row['id']] = $row;
            }

            if ($this->selectBestCandidate(array_values($candidates), $target) !== null) {
                break;
            }
        }

        if ($candidates === []) {
            throw new RuntimeException(
                $lastMessage !== ''
                    ? $lastMessage
                    : 'Data tujuan logistik tidak ditemukan oleh RajaOngkir.'
            );
        }

        return array_values($candidates);
    }

    private function buildSearchQueries(array $target): array
    {
        $queries = [
            $target['postal_code'],
            $target['subdistrict'],
            $target['district'],
            $target['city_or_regency'],
            implode(' ', array_filter([
                $target['subdistrict'],
                $target['district'],
            ])),
            implode(' ', array_filter([
                $target['subdistrict'],
                $target['city_or_regency'],
            ])),
            implode(' ', array_filter([
                $target['district'],
                $target['city_or_regency'],
            ])),
        ];

        return collect($queries)
            ->map(
                fn (string $query): string => trim(
                    preg_replace('/\s+/', ' ', $query) ?? ''
                )
            )
            ->filter(fn (string $query): bool => $query !== '')
            ->unique()
            ->values()
            ->all();
    }

    private function selectBestCandidate(array $candidates, array $target): ?array
    {
        $ranked = collect($candidates)
            ->map(function (array $candidate) use ($target): array {
                $candidate['_score'] = $this->scoreCandidate(
                    $candidate,
                    $target
                );
                $candidate['_accepted'] = $this->isAcceptableCandidate(
                    $candidate,
                    $target
                );

                return $candidate;
            })
            ->filter(
                fn (array $candidate): bool => (bool) ($candidate['_accepted'] ?? false)
            )
            ->sortByDesc('_score')
            ->values();

        $best = $ranked->first();

        if (! $best) {
            return null;
        }

        unset($best['_score'], $best['_accepted']);

        return $best;
    }

    private function isAcceptableCandidate(
        array $candidate,
        array $target
    ): bool {
        $candidatePostalCode = $this->normalizePostalCode(
            (string) ($candidate['zip_code'] ?? '')
        );
        $candidateCity = $this->normalizeText(
            (string) ($candidate['city_name'] ?? '')
        );
        $candidateDistrict = $this->normalizeText(
            (string) ($candidate['district_name'] ?? '')
        );
        $candidateSubdistrict = $this->normalizeText(
            (string) ($candidate['subdistrict_name'] ?? '')
        );

        $postalMatches =
            $target['postal_code'] !== ''
            && $target['postal_code'] === $candidatePostalCode;
        $cityMatches = $this->matches(
            $target['city_or_regency'],
            $candidateCity
        );
        $districtMatches = $this->matches(
            $target['district'],
            $candidateDistrict
        );
        $subdistrictMatches = $this->matches(
            $target['subdistrict'],
            $candidateSubdistrict
        );
        $score = (int) ($candidate['_score'] ?? 0);

        if ($postalMatches && ($cityMatches || $districtMatches || $subdistrictMatches)) {
            return true;
        }

        if ($subdistrictMatches && ($districtMatches || $cityMatches)) {
            return true;
        }

        if ($districtMatches && $cityMatches && $score >= 45) {
            return true;
        }

        return $score >= 70;
    }

    private function scoreCandidate(array $candidate, array $target): int
    {
        $province = $this->normalizeText(
            (string) ($candidate['province_name'] ?? '')
        );
        $city = $this->normalizeText(
            (string) ($candidate['city_name'] ?? '')
        );
        $district = $this->normalizeText(
            (string) ($candidate['district_name'] ?? '')
        );
        $subdistrict = $this->normalizeText(
            (string) ($candidate['subdistrict_name'] ?? '')
        );
        $postalCode = $this->normalizePostalCode(
            (string) ($candidate['zip_code'] ?? '')
        );
        $label = $this->normalizeText(
            (string) ($candidate['label'] ?? '')
        );

        $score = 0;
        $score += $this->matchScore($target['province'], $province, 10, 5);
        $score += $this->matchScore($target['city_or_regency'], $city, 25, 12);
        $score += $this->matchScore($target['district'], $district, 35, 18);
        $score += $this->matchScore($target['subdistrict'], $subdistrict, 50, 25);

        if ($target['postal_code'] !== '' && $target['postal_code'] === $postalCode) {
            $score += 60;
        }

        foreach ([
            [$target['subdistrict'], 10],
            [$target['district'], 8],
            [$target['city_or_regency'], 6],
            [$target['province'], 4],
        ] as [$expected, $weight]) {
            if ($expected !== '' && str_contains($label, $expected)) {
                $score += $weight;
            }
        }

        return $score;
    }

    private function matchScore(
        string $expected,
        string $actual,
        int $exact,
        int $contains
    ): int {
        if ($expected === '' || $actual === '') {
            return 0;
        }

        if ($expected === $actual) {
            return $exact;
        }

        return $this->matches($expected, $actual) ? $contains : 0;
    }

    private function matches(string $expected, string $actual): bool
    {
        if ($expected === '' || $actual === '') {
            return false;
        }

        return $expected === $actual
            || str_contains($expected, $actual)
            || str_contains($actual, $expected);
    }

    private function normalizeAddress(array $address): array
    {
        return [
            'country' => $this->normalizeText(
                (string) ($address['country'] ?? 'Indonesia')
            ),
            'province' => $this->normalizeText(
                (string) ($address['province'] ?? '')
            ),
            'city_or_regency' => $this->normalizeText(
                (string) ($address['city_or_regency'] ?? '')
            ),
            'district' => $this->normalizeText(
                (string) ($address['district'] ?? '')
            ),
            'subdistrict' => $this->normalizeText(
                (string) ($address['subdistrict'] ?? '')
            ),
            'postal_code' => $this->normalizePostalCode(
                (string) ($address['postal_code'] ?? '')
            ),
        ];
    }

    private function validateTarget(array $target): void
    {
        if (
            $target['province'] === ''
            || $target['city_or_regency'] === ''
            || $target['district'] === ''
            || $target['subdistrict'] === ''
        ) {
            throw new RuntimeException(
                'Provinsi, kota/kabupaten, kecamatan, dan kelurahan wajib diisi untuk mencari tujuan logistik.'
            );
        }
    }

    private function normalizeText(string $value): string
    {
        $value = Str::lower(Str::ascii(trim($value)));
        $value = preg_replace(
            '/\b(provinsi|province|kabupaten|regency|kota|city|kecamatan|district|kelurahan|desa|village)\b/u',
            ' ',
            $value
        ) ?? $value;
        $value = preg_replace('/[^a-z0-9]+/u', ' ', $value) ?? $value;

        return trim(preg_replace('/\s+/', ' ', $value) ?? $value);
    }

    private function normalizePostalCode(string $value): string
    {
        return preg_replace('/\D+/', '', $value) ?? '';
    }

    private function destinationUrl(): string
    {
        $configured = trim(
            (string) config('services.shipping.destination_base_url', '')
        );

        if ($configured !== '') {
            $baseUrl = rtrim($configured, '/');

            if (str_ends_with($baseUrl, '/domestic-destination')) {
                return $baseUrl;
            }

            return $baseUrl.'/destination/domestic-destination';
        }

        $baseUrl = rtrim(
            (string) config('services.shipping.base_url'),
            '/'
        );

        if ($baseUrl === '') {
            $baseUrl = 'https://rajaongkir.komerce.id/api/v1';
        }

        $baseUrl = preg_replace(
            '#/calculate/(district/)?domestic-cost$#',
            '',
            $baseUrl
        ) ?? $baseUrl;
        $baseUrl = preg_replace('#/calculate$#', '', $baseUrl) ?? $baseUrl;
        $baseUrl = rtrim($baseUrl, '/');

        if (str_ends_with($baseUrl, '/domestic-destination')) {
            return $baseUrl;
        }

        return $baseUrl.'/destination/domestic-destination';
    }

    private function client(string $apiKey): PendingRequest
    {
        return Http::acceptJson()
            ->timeout((int) config('services.shipping.timeout', 15))
            ->retry(2, 300)
            ->withHeaders([
                'key' => $apiKey,
            ]);
    }
}
