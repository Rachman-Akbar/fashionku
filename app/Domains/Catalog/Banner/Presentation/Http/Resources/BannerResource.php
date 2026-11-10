<?php

declare(strict_types=1);

namespace App\Domains\Catalog\Banner\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class BannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_id' => $this->storeId,
            'name' => $this->name,
            'image_url' => $this->imageUrl,
            'sort_order' => $this->sortOrder,
            'is_active' => $this->isActive,
        ];
    }
}
