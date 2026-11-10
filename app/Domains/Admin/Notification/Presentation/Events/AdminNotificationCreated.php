<?php

declare(strict_types=1);

namespace App\Domains\Admin\Notification\Presentation\Events;

use App\Domains\Admin\Notification\Infrastructure\Persistence\Models\AdminNotificationModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class AdminNotificationCreated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public AdminNotificationModel $notification) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('admin.'.$this->notification->user_id.'.notifications')];
    }

    public function broadcastAs(): string
    {
        return 'admin.notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->notification->id,
            'module' => $this->notification->module,
            'type' => $this->notification->type,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'reference_type' => $this->notification->reference_type,
            'reference_id' => $this->notification->reference_id,
            'url' => $this->notification->url,
            'meta' => $this->notification->meta,
            'actor' => $this->notification->actor ? [
                'id' => $this->notification->actor->id,
                'name' => $this->notification->actor->name,
                'avatar' => $this->notification->actor->avatar,
            ] : null,
            'store' => $this->notification->store ? [
                'id' => $this->notification->store->id,
                'name' => $this->notification->store->name,
                'logo' => $this->notification->store->logo,
            ] : null,
            'read_at' => null,
            'created_at' => $this->notification->created_at?->toIso8601String(),
            'delta' => 1,
        ];
    }
}
