<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $activeRole = $request->attributes->get('active_role');

        if (! is_string($activeRole) || $activeRole === '') {
            $ability = collect($request->user()?->currentAccessToken()?->abilities ?? [])
                ->first(fn (mixed $value): bool => is_string($value) && str_starts_with($value, 'active-role:'));
            $activeRole = is_string($ability) ? substr($ability, strlen('active-role:')) : null;
        }

        $messages = $this->relationLoaded('messages')
            ? $this->messages->when(strtolower((string) $activeRole) !== 'admin', fn ($rows) => $rows->where('is_internal', false))
            : collect();

        return [
            'id' => $this->id,
            'ticket_number' => $this->ticket_number,
            'user_id' => $this->user_id,
            'user_name' => $this->user?->name,
            'user_email' => $this->user?->email,
            'store_id' => $this->store_id,
            'store_name' => $this->store?->name,
            'order_id' => $this->order_id,
            'order_number' => $this->order?->order_number,
            'category' => $this->category,
            'subject' => $this->subject,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'assigned_name' => $this->assignee?->name,
            'messages_count' => $this->messages_count ?? $messages->count(),
            'messages' => $this->whenLoaded('messages', fn () => $messages->map(fn ($message) => [
                'id' => $message->id,
                'user_id' => $message->user_id,
                'user_name' => $message->user?->name,
                'message' => $message->message,
                'attachments' => $message->attachments,
                'is_internal' => (bool) $message->is_internal,
                'read_at' => $message->read_at?->toIso8601String(),
                'created_at' => $message->created_at?->toIso8601String(),
            ])->values()),
            'last_replied_at' => $this->last_replied_at?->toIso8601String(),
            'resolved_at' => $this->resolved_at?->toIso8601String(),
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
