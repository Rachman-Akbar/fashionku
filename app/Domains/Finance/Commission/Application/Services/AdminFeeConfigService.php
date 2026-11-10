<?php

declare(strict_types=1);

namespace App\Domains\Finance\Commission\Application\Services;

use App\Domains\Finance\Commission\Domain\Entities\AdminFeeConfig;
use App\Domains\Finance\Commission\Domain\Repositories\AdminFeeConfigRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class AdminFeeConfigService
{
    private const CACHE_TTL = 3600;

    public function __construct(
        private AdminFeeConfigRepositoryInterface $repository
    ) {}

    public function calculateFee(float $amount, ?int $categoryId = null): float
    {
        $cacheKey = $categoryId
            ? "fee_config_category_{$categoryId}"
            : 'fee_config_default';

        $config = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($categoryId) {
            return $categoryId
                ? $this->repository->findByCategoryId($categoryId)
                : $this->repository->findDefault();
        });

        if (! $config) {
            return 0.0;
        }

        return $config->calculateFee($amount);
    }

    public function getAll(): array
    {
        return Cache::remember('fee_configs_active', self::CACHE_TTL, function () {
            return $this->repository->getActive();
        });
    }

    public function getById(int $id): ?AdminFeeConfig
    {
        return Cache::remember("fee_config_{$id}", self::CACHE_TTL, function () use ($id) {
            return $this->repository->findById($id);
        });
    }

    public function create(array $data): AdminFeeConfig
    {
        $config = $this->repository->create($data);
        $this->clearCache();

        return $config;
    }

    public function update(int $id, array $data): AdminFeeConfig
    {
        $config = $this->repository->update($id, $data);
        $this->clearCache();

        return $config;
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
        $this->clearCache();
    }

    private function clearCache(): void
    {
        Cache::forget('fee_configs_active');
        Cache::forget('fee_config_default');

        $configs = $this->repository->getActive();
        foreach ($configs as $config) {
            Cache::forget("fee_config_{$config->id}");
            if ($config->categoryId) {
                Cache::forget("fee_config_category_{$config->categoryId}");
            }
        }
    }
}
