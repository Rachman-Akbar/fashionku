<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Services;

use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use Illuminate\Support\Str;

/**
 * Helper hierarki kategori 3 level untuk import/export Excel.
 * Semua nama diproses strtolower(trim()) dan pencarian induk selalu
 * diikat ke parent_id agar nama anak yang sama pada induk berbeda tidak salah induk.
 */
final class CategoryTreeService
{
    public const MAX_LEVEL = 3;

    public function normalize(?string $name): string
    {
        $name = (string) preg_replace('/\s+/u', ' ', (string) $name);

        return Str::lower(trim($name));
    }

    /**
     * @return array<int, string> nama per level (index 0 = level 1)
     */
    public function levelsFromRow(array $row): array
    {
        return [
            $this->normalize($row['kategori_level_1'] ?? null),
            $this->normalize($row['kategori_level_2'] ?? null),
            $this->normalize($row['kategori_level_3'] ?? null),
        ];
    }

    /**
     * Cari kategori berdasarkan path level 1 -> 3 tanpa membuat data baru.
     *
     * @param  array<int, string>  $levels
     */
    public function findPath(array $levels): ?CategoryModel
    {
        $parent = null;
        $found = null;

        foreach (array_slice($levels, 0, self::MAX_LEVEL) as $index => $name) {
            $name = $this->normalize($name);

            if ($name === '') {
                break;
            }

            $parent = CategoryModel::query()
                ->withTrashed()
                ->where('level', $index + 1)
                ->where('parent_scope_id', $parent?->id ?? 0)
                ->whereRaw('LOWER(TRIM(name)) = ?', [$name])
                ->first();

            if (! $parent) {
                return null;
            }

            $found = $parent;
        }

        return $found;
    }

    /**
     * Cari kategori berdasarkan satu nama (format import ringkas: satu kolom
     * "kategori"). Nama dicocokkan case-insensitive; bila ada di beberapa level,
     * dipilih yang paling dalam (level tertinggi) agar cocok sebagai daun.
     */
    public function findByName(?string $name): ?CategoryModel
    {
        $name = $this->normalize($name);

        if ($name === '') {
            return null;
        }

        return CategoryModel::query()
            ->withTrashed()
            ->whereRaw('LOWER(TRIM(name)) = ?', [$name])
            ->orderByDesc('level')
            ->orderByDesc('id')
            ->first();
    }

    /**
     * Proses level 1 -> 2 -> 3 dengan firstOrCreate yang terikat parent_id.
     *
     * @param  array<int, string>  $levels
     * @param  array<string, mixed>  $attributes  atribut yang diterapkan pada level terdalam
     * @return array{category: CategoryModel|null, created: int}
     */
    public function resolveOrCreate(array $levels, array $attributes = []): array
    {
        $parent = null;
        $created = 0;
        $levels = array_slice($levels, 0, self::MAX_LEVEL);

        foreach ($levels as $index => $name) {
            $name = $this->normalize($name);

            if ($name === '') {
                break;
            }

            $level = $index + 1;
            $scopeId = $parent?->id ?? 0;
            $slug = Str::slug($name) ?: 'kategori-'.$level;
            $fullSlug = $parent ? $parent->full_slug.'/'.$slug : $slug;

            $category = CategoryModel::query()
                ->withTrashed()
                ->where('parent_scope_id', $scopeId)
                ->whereRaw('LOWER(TRIM(name)) = ?', [$name])
                ->first();

            if ($category) {
                if ($category->trashed()) {
                    $category->restore();
                }
            } else {
                $category = CategoryModel::query()->create([
                    'parent_id' => $parent?->id,
                    'parent_scope_id' => $scopeId,
                    'level' => $level,
                    'name' => $name,
                    'slug' => $slug,
                    'full_slug' => $this->uniqueFullSlug($fullSlug),
                    'sort_order' => 0,
                    'is_active' => true,
                    'is_visible_in_menu' => true,
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]);
                $created++;
            }

            if ($level === count(array_filter($levels, fn (string $value): bool => $value !== '')) && $attributes !== []) {
                $payload = $attributes;

                // Constraint database: hanya level 3 yang boleh menyimpan media.
                if ($level < self::MAX_LEVEL) {
                    $payload['image_url'] = null;
                    $payload['icon_url'] = null;
                }

                $payload['updated_by'] = auth()->id();
                $category->forceFill($payload)->save();
            }

            $parent = $category;
        }

        return ['category' => $parent, 'created' => $created];
    }

    /**
     * @return array<int, string> path nama level 1..3
     */
    public function path(CategoryModel $category): array
    {
        $names = [];
        $current = $category->parent;

        while ($current) {
            array_unshift($names, (string) $current->name);
            $current = $current->parent;
        }

        $names[] = (string) $category->name;

        return array_slice($names, 0, self::MAX_LEVEL);
    }

    private function uniqueFullSlug(string $base): string
    {
        $candidate = $base;
        $suffix = 2;

        while (CategoryModel::query()->withTrashed()->where('full_slug', $candidate)->exists()) {
            $candidate = $base.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }
}
