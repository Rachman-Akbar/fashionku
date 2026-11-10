<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\UseCases;

use App\Domains\Catalog\Category\Application\Dtos\CategoryData;
use App\Domains\Catalog\Category\Application\Policies\CategoryHierarchyPolicy;
use App\Domains\Catalog\Category\Domain\Entities\Category;
use App\Domains\Catalog\Category\Domain\Repositories\CategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class UpdateCategoryUseCase
{
    public function __construct(
        private CategoryRepositoryInterface $repository,
        private CategoryHierarchyPolicy $hierarchyPolicy,
    ) {}

    public function execute(int $id, CategoryData $data): ?Category
    {
        return DB::transaction(function () use ($id, $data): ?Category {
            $category = $this->repository->findById($id, true);

            if (! $category) {
                return null;
            }

            $payload = $data->toUpdatePayload($category);
            $newParent = null;
            $parentTouched = $data->hasParentId();
            $parentChanged = false;

            if ($parentTouched) {
                $newParentId = $data->parentId();
                $parentChanged = $newParentId !== $category->parentId();

                if ($newParentId === $category->id()) {
                    throw new InvalidArgumentException('Kategori tidak bisa menjadi parent dari dirinya sendiri.');
                }

                if ($newParentId !== null) {
                    if ($this->repository->isDescendantOf((int) $category->id(), $newParentId)) {
                        throw new InvalidArgumentException('Kategori tidak bisa dipindahkan ke child miliknya sendiri.');
                    }

                    $newParent = $this->repository->findById($newParentId, true);

                    if (! $newParent) {
                        throw new InvalidArgumentException('Parent category baru tidak ditemukan.');
                    }
                }

                $this->hierarchyPolicy->assertCanMove(
                    $category,
                    $newParent,
                    $this->repository->maxDepthFrom((int) $category->id())
                );
            }

            $currentParent = null;

            if (! $parentTouched && $category->parentId() !== null && array_key_exists('slug', $payload)) {
                $currentParent = $this->repository->findById((int) $category->parentId(), true);
            }

            $resultingParent = $parentTouched ? $newParent : $currentParent;
            $resultingParentId = $parentTouched ? $newParent?->id() : $category->parentId();
            $resultingCatalogGroupId = $newParent?->catalogGroupId()
                ?? (isset($payload['catalog_group_id']) ? (int) $payload['catalog_group_id'] : $category->catalogGroupId());
            $resultingName = (string) ($payload['name'] ?? $category->name());

            if ($this->repository->nameExistsInParent(
                $resultingCatalogGroupId,
                $resultingParentId,
                $resultingName,
                (int) $category->id()
            )) {
                throw new InvalidArgumentException('Nama kategori sudah digunakan pada parent yang sama.');
            }

            $resultingLevel = $resultingParent ? $resultingParent->level() + 1 : 1;

            if ($resultingLevel !== 3) {
                $payload['image_url'] = null;
                $payload['icon_url'] = null;
            }

            $category->updateData($payload, $resultingParent);
            $updatedCategory = $this->repository->save($category);

            if (
                $parentChanged
                || array_key_exists('slug', $payload)
                || array_key_exists('catalog_group_id', $payload)
            ) {
                $this->updateChildrenHierarchies($updatedCategory);
            }

            return $updatedCategory;
        });
    }

    private function updateChildrenHierarchies(Category $parent): void
    {
        $children = $this->repository->findChildrenByParentId((int) $parent->id(), true);

        foreach ($children as $child) {
            $child->updateData([], $parent);
            $savedChild = $this->repository->save($child);
            $this->updateChildrenHierarchies($savedChild);
        }
    }
}
