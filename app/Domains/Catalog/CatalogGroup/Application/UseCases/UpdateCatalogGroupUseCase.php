<?php

declare(strict_types=1);

namespace App\Domains\Catalog\CatalogGroup\Application\UseCases;

use App\Domains\Catalog\CatalogGroup\Application\Dtos\CatalogGroupData;
use App\Domains\Catalog\CatalogGroup\Domain\Entities\CatalogGroup;
use App\Domains\Catalog\CatalogGroup\Domain\Repositories\CatalogGroupRepositoryInterface;
use Illuminate\Support\Str;
use InvalidArgumentException;

final class UpdateCatalogGroupUseCase
{
    public function __construct(
        private CatalogGroupRepositoryInterface $repository
    ) {}

    public function execute(int $id, CatalogGroupData $data): ?CatalogGroup
    {
        $catalogGroup = $this->repository->findById($id, true);

        if (! $catalogGroup) {
            return null;
        }

        $name = $data->hasName()
            ? trim((string) preg_replace('/\s+/u', ' ', (string) $data->name()))
            : $catalogGroup->name();

        if ($this->repository->nameExists($name, $id)) {
            throw new InvalidArgumentException('Nama kelompok katalog sudah digunakan.');
        }

        $slug = match (true) {
            $data->hasSlug() => $data->slug() ?: Str::slug($name),
            $data->hasName() => Str::slug($name),
            default => $catalogGroup->slug(),
        };

        $catalogGroup->updateData([
            'name' => $name,
            'slug' => $slug,
            'is_active' => $data->hasIsActive()
                ? (bool) $data->isActive()
                : $catalogGroup->isActive(),
        ]);

        return $this->repository->save($catalogGroup);
    }
}
