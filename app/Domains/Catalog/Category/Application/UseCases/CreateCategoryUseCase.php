<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\UseCases;

use App\Domains\Catalog\Category\Application\Dtos\CategoryData;
use App\Domains\Catalog\Category\Application\Policies\CategoryHierarchyPolicy;
use App\Domains\Catalog\Category\Domain\Entities\Category;
use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;
use InvalidArgumentException;

final class CreateCategoryUseCase
{
    public function __construct(
        private CategoryRepositoryInterface $repository,
        private CategoryHierarchyPolicy $hierarchyPolicy,
    ) {}

    public function execute(CategoryData $data): Category
    {
        $parent = null;

        if ($data->hasParentId() && $data->parentId() !== null) {
            $parent = $this->repository->findById($data->parentId(), true);

            if (! $parent) {
                throw new InvalidArgumentException('Parent category tidak ditemukan.');
            }
        }

        $this->hierarchyPolicy->assertCanCreate($parent);
        $payload = $data->toCreatePayload($parent);
        $catalogGroupId = (int) $payload['catalog_group_id'];
        $parentId = $parent?->id();

        if ($this->repository->nameExistsInParent($catalogGroupId, $parentId, $payload['name'])) {
            throw new InvalidArgumentException('Nama kategori sudah digunakan pada parent yang sama.');
        }

        $level = $parent ? $parent->level() + 1 : 1;
        $imageUrl = $level === 3 ? $payload['image_url'] : null;
        $iconUrl = $level === 3 ? $payload['icon_url'] : null;

        $category = Category::createNew(
            catalogGroupId: $catalogGroupId,
            parent: $parent,
            name: $payload['name'],
            slug: $payload['slug'],
            sortOrder: (int) $payload['sort_order'],
            isActive: (bool) $payload['is_active'],
            isVisibleInMenu: (bool) $payload['is_visible_in_menu'],
            imageUrl: $imageUrl,
            iconUrl: $iconUrl,
        );

        return $this->repository->save($category);
    }
}
