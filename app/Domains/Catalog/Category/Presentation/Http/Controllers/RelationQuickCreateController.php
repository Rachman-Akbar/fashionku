<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Presentation\Http\Controllers;

use App\Domains\Catalog\CatalogGroup\Infrastructure\Persistence\Models\CatalogGroupModel;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;

final class RelationQuickCreateController extends Controller
{
    public function catalogGroup(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255']]);
        $name = $this->displayName($data['name']);
        $model = $this->findByName(CatalogGroupModel::query(), $name);
        $created = false;

        if (! $model) {
            $model = new CatalogGroupModel;
            $model->fill([
                'name' => $name,
                'slug' => $this->uniqueSlug(CatalogGroupModel::query(), Str::slug($name)),
                'is_active' => true,
            ])->save();
            $created = true;
        }

        return response()->json([
            'success' => true,
            'message' => $created ? 'Catalog Group berhasil dibuat.' : 'Catalog Group yang sama sudah tersedia.',
            'data' => [
                'id' => (int) $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
                'is_active' => (bool) $model->is_active,
                'created' => $created,
            ],
        ], $created ? 201 : 200);
    }

    public function category(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'catalog_group_name' => ['nullable', 'string', 'max:255'],
            'parent_category_name' => ['nullable', 'string', 'max:255'],
        ]);
        $name = $this->displayName($data['name']);
        $groupName = $this->displayName($data['catalog_group_name'] ?? 'Lainnya');
        $group = $this->findByName(CatalogGroupModel::query(), $groupName);

        if (! $group) {
            $group = new CatalogGroupModel;
            $group->fill([
                'name' => $groupName,
                'slug' => $this->uniqueSlug(CatalogGroupModel::query(), Str::slug($groupName)),
                'is_active' => true,
            ])->save();
        }

        $parent = null;
        $parentName = $this->displayName($data['parent_category_name'] ?? '');
        if ($parentName !== '') {
            $parent = $this->findByName(CategoryModel::query()->where('catalog_group_id', $group->id), $parentName);
            if (! $parent) {
                $parent = $this->createCategory($group, null, $parentName);
            }
        }

        $query = CategoryModel::query()
            ->where('catalog_group_id', $group->id)
            ->where('parent_scope_id', $parent?->id ?: 0);
        $category = $this->findByName($query, $name);
        $created = false;

        if (! $category) {
            $category = $this->createCategory($group, $parent, $name);
            $created = true;
        }

        return response()->json([
            'success' => true,
            'message' => $created ? 'Category berhasil dibuat.' : 'Category yang sama sudah tersedia.',
            'data' => [
                'id' => (int) $category->id,
                'catalog_group_id' => (int) $category->catalog_group_id,
                'catalog_group_name' => $group->name,
                'parent_id' => $category->parent_id ? (int) $category->parent_id : null,
                'name' => $category->name,
                'slug' => $category->slug,
                'full_slug' => $category->full_slug,
                'level' => (int) $category->level,
                'is_active' => (bool) $category->is_active,
                'created' => $created,
            ],
        ], $created ? 201 : 200);
    }

    private function createCategory(CatalogGroupModel $group, ?CategoryModel $parent, string $name): CategoryModel
    {
        $level = $parent ? ((int) $parent->level + 1) : 1;
        abort_if($level > 3, 422, 'Category hanya boleh sampai Level 3.');
        $slug = Str::slug($name);
        $model = new CategoryModel;
        $model->fill([
            'catalog_group_id' => $group->id,
            'parent_id' => $parent?->id,
            'parent_scope_id' => $parent?->id ?: 0,
            'level' => $level,
            'sort_order' => 0,
            'is_active' => true,
            'is_visible_in_menu' => true,
            'name' => $name,
            'slug' => $slug,
            'full_slug' => $parent ? trim($parent->full_slug.'/'.$slug, '/') : $slug,
        ])->save();

        return $model;
    }

    private function findByName(Builder $query, string $name)
    {
        return $query->whereRaw('LOWER(TRIM(name)) = ?', [Str::lower(trim($name))])->first();
    }

    private function displayName(mixed $value): string
    {
        $clean = trim((string) preg_replace('/\s+/u', ' ', (string) ($value ?? '')));
        if ($clean === '') {
            return '';
        }

        return $clean;
    }

    private function uniqueSlug(Builder $query, string $base): string
    {
        $root = $base !== '' ? $base : 'data';
        $slug = $root;
        $counter = 2;
        while ((clone $query)->where('slug', $slug)->exists()) {
            $slug = $root.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
