<?php

declare(strict_types=1);

namespace App\Domains\Catalog\CatalogGroup\Application\UseCases;

use App\Domains\Catalog\CatalogGroup\Application\Dtos\CatalogGroupData;
use App\Domains\Catalog\CatalogGroup\Domain\Entities\CatalogGroup;
use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class CreateCatalogGroupUseCase
{
    public function __construct(
        private CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(CatalogGroupData $data): CatalogGroup
    {
        $name = trim((string) preg_replace('/\s+/u', ' ', (string) $data->name()));

        if ($this->repository->nameExists($name)) {
            throw new InvalidArgumentException('Nama kelompok katalog sudah digunakan.');
        }

        return $this->repository->save(new CatalogGroup(
            id: null,
            name: $name,
            slug: $data->slug() ?: Str::slug($name),
            isActive: $data->isActive() ?? true
        ));
    }
}
