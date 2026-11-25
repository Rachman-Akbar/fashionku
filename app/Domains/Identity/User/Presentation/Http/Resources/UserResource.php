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
            'firebase_uid' => $this->resource->firebase_uid,
            'email' => $this->resource->email,
            'has_set_password' => (bool) $this->resource->has_set_password,
            'name' => $this->resource->name,
            'avatar' => $this->resource->avatar,
            'is_email_verified' => (bool) $this->resource->is_email_verified,
            'is_active' => (bool) $this->resource->is_active,
            'created_by_user' => $this->resource->created_by
                ? ['id' => $this->resource->created_by, 'name' => $this->resource->creator?->name]
                : null,
            'updated_by_user' => $this->resource->updated_by
                ? ['id' => $this->resource->updated_by, 'name' => $this->resource->updater?->name]
                : null,
            'roles' => $this->resource->roles->map(fn ($role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'is_active' => (bool) $role->is_active,
            ])->values()->all(),
            'created_at' => $this->resource->created_at?->toDateTimeString(),
            'updated_at' => $this->resource->updated_at?->toDateTimeString(),
            'deleted_at' => $this->resource->deleted_at?->toDateTimeString(),
        ];
    }
}
