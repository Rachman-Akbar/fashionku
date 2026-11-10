<?php

namespace App\Domains\Catalog\CatalogGroup\Presentation\Http\Resources;

use App\Domains\Catalog\Category\Presentation\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatalogGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // $this->resource adalah objek Domain Entity CatalogGroup
        return [
            'id' => $this->resource->id(),
            'name' => $this->resource->name(),
            'slug' => $this->resource->slug(),
            'is_active' => $this->resource->isActive(),
            'categories' => CategoryResource::collection($this->resource->categories()),
        ];
    }
}
