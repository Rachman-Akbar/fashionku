<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Presentation\Events;

use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ChatMessageModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public ChatMessageModel $message) {}

    public function broadcastOn(): array
    {
        $channels = [new PrivateChannel('conversation.'.$this->message->conversation_id)];
        $conversation = $this->message->relationLoaded('conversation') ? $this->message->conversation : null;

        if ($conversation?->relationLoaded('participants')) {
            foreach ($conversation->participants as $participant) {
                $channels[] = new PrivateChannel('chat.user.'.$participant->id);
            }
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'chat.message.sent';
    }

    public function broadcastWith(): array
    {
        $store = $this->message->relationLoaded('conversation') && $this->message->conversation?->relationLoaded('store')
            ? $this->message->conversation->store
            : null;
        $storeIdentity = $store !== null && (string) $store->user_id === (string) $this->message->sender_id;

        return [
            'id' => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'conversation_type' => $this->message->conversation?->type,
            'store_id' => $this->message->conversation?->store_id,
            'order_id' => $this->message->conversation?->order_id,
            'subject' => $this->message->conversation?->subject,
            'sender_id' => $this->message->sender_id,
            'sender_name' => $storeIdentity ? $store->name : $this->message->sender?->name,
            'sender_avatar' => $storeIdentity ? $store->logo : $this->message->sender?->avatar,
            'sender_identity_type' => $storeIdentity ? 'store' : 'user',
            'message_type' => $this->message->message_type,
            'message' => $this->message->message,
            'attachments' => $this->message->attachments,
            'created_at' => $this->message->created_at?->toIso8601String(),
        ];
    }
}
