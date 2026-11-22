<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Application\Excel;

use App\Domains\Catalog\Category\Application\Services\CategoryTreeService;
use App\Domains\Catalog\Category\Infrastructure\Persistence\Models\CategoryModel;
use App\Domains\Shared\Excel\Application\Exports\BaseExport;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CategoryExport extends BaseExport
{
    protected int $imageColumnIndex = 3;

    protected string $imagePathColumn = 'image_url';

    protected int $imageWidth = 80;

    protected int $imageHeight = 80;

    public function __construct(protected ?Collection $categories = null) {}

    public function collection(): Collection
    {
        if ($this->categories !== null) {
            return $this->categories;
        }

        return CategoryModel::query()
            ->with(['parent.parent'])
            ->orderBy('level')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function headings(): array
    {
        return [
            'kategori_level_1',
            'kategori_level_2',
            'kategori_level_3',
            'image_url',
            'icon_url',
            'sort_order',
            'aktif',
            'visible_in_menu',
        ];
    }

    public function map($category): array
    {
        $path = app(CategoryTreeService::class)->path($category);

        return [
            Str::lower(trim((string) ($path[0] ?? ''))),
            Str::lower(trim((string) ($path[1] ?? ''))),
            Str::lower(trim((string) ($path[2] ?? ''))),
            $category->image_url ?? '',
            $category->icon_url ?? '',
            $category->sort_order ?? 0,
            $category->is_active ? 'ya' : 'tidak',
            $category->is_visible_in_menu ? 'ya' : 'tidak',
        ];
    }
}
