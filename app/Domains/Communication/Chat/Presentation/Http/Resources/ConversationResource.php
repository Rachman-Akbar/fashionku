<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'store_id' => $this->store_id,
            'store_name' => $this->store?->name,
            'store_logo' => $this->store?->logo,
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'order_status' => $this->order?->status,
            'subject' => $this->subject,
            'target_role' => $this->target_role,
            'is_active' => (bool) $this->is_active,
            'unread_count' => (int) ($this->unread_count ?? 0),
            'participants' => $this->whenLoaded('participants', fn () => $this->participants->map(function ($participant): array {
                $identity = $this->participantIdentity($participant);

                return [
                    'id' => $participant->id,
                    'name' => $identity['name'],
                    'avatar' => $identity['avatar'],
                    'identity_type' => $identity['identity_type'],
                    'last_read_at' => $participant->pivot?->last_read_at,
                    'is_muted' => (bool) ($participant->pivot?->is_muted ?? false),
                ];
            })->values()),
            'latest_message' => $this->whenLoaded('latestMessage', function () {
                $message = $this->latestMessage->first();
                if (! $message) {
                    return null;
                }
                $identity = $this->messageIdentity($message);

                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $identity['name'],
                    'sender_avatar' => $identity['avatar'],
                    'sender_identity_type' => $identity['identity_type'],
                    'message_type' => $message->message_type,
                    'message' => $message->message,
                    'created_at' => $message->created_at?->toIso8601String(),
                ];
            }),
            'messages' => $this->whenLoaded('messages', fn () => $this->messages->map(function ($message): array {
                $identity = $this->messageIdentity($message);

                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $identity['name'],
                    'sender_avatar' => $identity['avatar'],
                    'sender_identity_type' => $identity['identity_type'],
                    'message_type' => $message->message_type,
                    'message' => $message->message,
                    'attachments' => $message->attachments,
                    'read_by' => $message->relationLoaded('readers') ? $message->readers->pluck('id')->values() : [],
                    'edited_at' => $message->edited_at?->toIso8601String(),
                    'created_at' => $message->created_at?->toIso8601String(),
                ];
            })->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function participantIdentity(mixed $participant): array
    {
        if ($this->isStoreOwner((string) $participant->id)) {
            return [
                'name' => (string) $this->store->name,
                'avatar' => $this->store->logo,
                'identity_type' => 'store',
            ];
        }

        return [
            'name' => $participant->name,
            'avatar' => $participant->avatar,
            'identity_type' => 'user',
        ];
    }

    private function messageIdentity(mixed $message): array
    {
        if ($this->isStoreOwner((string) $message->sender_id)) {
            return [
                'name' => (string) $this->store->name,
                'avatar' => $this->store->logo,
                'identity_type' => 'store',
            ];
        }

        return [
            'name' => $message->sender?->name,
            'avatar' => $message->sender?->avatar,
            'identity_type' => 'user',
        ];
    }

    private function isStoreOwner(string $userId): bool
    {
        return $this->relationLoaded('store')
            && $this->store !== null
            && (string) $this->store->user_id === $userId;
    }
}
