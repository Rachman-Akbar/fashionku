<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Presentation\Http\Controllers;

use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;

final class RelationQuickCreateController extends Controller
{
    public function category(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_category_name' => ['nullable', 'string', 'max:255'],
        ]);
        $name = $this->displayName($data['name']);

        $parent = null;
        $parentName = $this->displayName($data['parent_category_name'] ?? '');
        if ($parentName !== '') {
            $parent = $this->findByName(CategoryModel::query(), $parentName);
            if (! $parent) {
                $parent = $this->createCategory(null, $parentName);
            }
        }

        $query = CategoryModel::query()->where('parent_scope_id', $parent?->id ?: 0);
        $category = $this->findByName($query, $name);
        $created = false;

        if (! $category) {
            $category = $this->createCategory($parent, $name);
            $created = true;
        }

        return response()->json([
            'success' => true,
            'message' => $created ? 'Category berhasil dibuat.' : 'Category yang sama sudah tersedia.',
            'data' => [
                'id' => (int) $category->id,
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

    private function createCategory(?CategoryModel $parent, string $name): CategoryModel
    {
        $level = $parent ? ((int) $parent->level + 1) : 1;
        abort_if($level > 3, 422, 'Category hanya boleh sampai Level 3.');
        $slug = Str::slug($name);
        $model = new CategoryModel;
        $model->fill([
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
}