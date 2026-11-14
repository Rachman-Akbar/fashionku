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
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'order_status' => $this->order?->status,
            'subject' => $this->subject,
            'target_role' => $this->target_role,
            'is_active' => (bool) $this->is_active,
            'unread_count' => (int) ($this->unread_count ?? 0),
            'participants' => $this->whenLoaded('participants', fn () => $this->participants->map(fn ($participant): array => [
                'id' => $participant->id,
                'name' => $participant->name,
                'avatar' => $participant->avatar,
                'identity_type' => 'user',
                'last_read_at' => $participant->pivot?->last_read_at,
                'is_muted' => (bool) ($participant->pivot?->is_muted ?? false),
            ])->values()),
            'latest_message' => $this->whenLoaded('latestMessage', function () {
                $message = $this->latestMessage->first();
                if (! $message) {
                    return null;
                }

                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender?->name,
                    'sender_avatar' => $message->sender?->avatar,
                    'sender_identity_type' => 'user',
                    'message_type' => $message->message_type,
                    'message' => $message->message,
                    'created_at' => $message->created_at?->toIso8601String(),
                ];
            }),
            'messages' => $this->whenLoaded('messages', fn () => $this->messages->map(fn ($message): array => [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'sender_name' => $message->sender?->name,
                'sender_avatar' => $message->sender?->avatar,
                'sender_identity_type' => 'user',
                'message_type' => $message->message_type,
                'message' => $message->message,
                'attachments' => $message->attachments,
                'read_by' => $message->relationLoaded('readers') ? $message->readers->pluck('id')->values() : [],
                'edited_at' => $message->edited_at?->toIso8601String(),
                'created_at' => $message->created_at?->toIso8601String(),
            ])->values()),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
