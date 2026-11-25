<?php

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Channel privat notifikasi admin. Event `AdminNotificationCreated` melakukan
// broadcast ke `admin.{user_id}.notifications`, sehingga setiap admin hanya
// berlangganan ke channel miliknya sendiri.
Broadcast::channel('admin.{userId}.notifications', function (User $user, string $userId): bool {
    if ((string) $user->id !== (string) $userId) {
        return false;
    }

    return $user->hasRole('admin') || $user->hasRole('super_admin');
});
