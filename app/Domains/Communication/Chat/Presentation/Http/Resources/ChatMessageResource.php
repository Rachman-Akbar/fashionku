<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ChatMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $store = $this->relationLoaded('conversation') && $this->conversation?->relationLoaded('store')
            ? $this->conversation->store
            : null;
        $storeIdentity = $store !== null && (string) $store->user_id === (string) $this->sender_id;

        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'sender_name' => $storeIdentity ? $store->name : $this->sender?->name,
            'sender_avatar' => $storeIdentity ? $store->logo : $this->sender?->avatar,
            'sender_identity_type' => $storeIdentity ? 'store' : 'user',
            'message_type' => $this->message_type,
            'message' => $this->message,
            'attachments' => $this->attachments,
            'edited_at' => $this->edited_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
