<?php

declare(strict_types=1);

namespace App\Domains\Identity\User\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'email' => $this->resource->email,
            'name' => $this->resource->name,
            'avatar' => $this->resource->avatar,
            'is_email_verified' => (bool) $this->resource->is_email_verified,
            'is_active' => (bool) $this->resource->is_active,
            'banned_at' => $this->resource->banned_at?->toDateTimeString(),
            'roles' => $this->resource->roles->map(fn ($role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'is_active' => (bool) $role->is_active,
            ])->values()->all(),
            'created_at' => $this->resource->created_at?->toDateTimeString(),
            'updated_at' => $this->resource->updated_at?->toDateTimeString(),
        ];
    }
}
