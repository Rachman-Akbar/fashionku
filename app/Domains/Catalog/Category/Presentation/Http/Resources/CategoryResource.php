<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Category\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id(),
            'parent_id' => $this->resource->parentId(),
            'parent' => $this->resource->parent(),
            'parent_scope_id' => $this->resource->parentScopeId(),
            'name' => $this->resource->name(),
            'slug' => $this->resource->slug(),
            'full_slug' => $this->resource->fullSlug(),
            'image_url' => $this->resource->imageUrl(),
            'icon_url' => $this->resource->iconUrl(),
            'level' => $this->resource->level(),
            'sort_order' => $this->resource->sortOrder(),
            'products_count' => $this->resource->productsCount(),
            'is_active' => $this->resource->isActive(),
            'is_visible_in_menu' => $this->resource->isVisibleInMenu(),
            'created_by_user' => $this->resource->createdByUser(),
            'updated_by_user' => $this->resource->updatedByUser(),
            'created_at' => $this->resource->createdAt(),
            'updated_at' => $this->resource->updatedAt(),
            'deleted_at' => $this->resource->deletedAt(),
            'children' => self::collection($this->resource->children()),
        ];
    }
}
