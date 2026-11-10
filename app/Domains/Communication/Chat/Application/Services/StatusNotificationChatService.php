<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Application\Services;

use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ChatMessageModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Mengirim pesan notifikasi status (order / produk digital) ke dalam chat
 * user lewat percakapan langsung dengan admin sistem. Aman dipanggil ulang:
 * satu kombinas (kind + notification_key) hanya menghasilkan satu pesan.
 */
final class StatusNotificationChatService
{
    public function __construct(private readonly ConversationService $conversation) {}

    /**
     * @param  array<string, mixed>  $attachments
     */
    public function send(
        string $buyerId,
        string $title,
        string $message,
        array $attachments = [],
    ): ?ChatMessageModel {
        $adminId = $this->systemAdminId();

        if ($adminId === null || $buyerId === $adminId) {
            return null;
        }

        $kind = (string) ($attachments['kind'] ?? 'status');
        $key = (string) ($attachments['notification_key'] ?? '');
        $subject = (string) ($attachments['subject'] ?? $title);

        try {
            $conversation = $this->conversation->startModeration([
                'type' => 'direct',
                'subject' => $subject,
                'participant_ids' => [$buyerId],
            ], $adminId);

            if ($this->notificationSent($conversation->id, $kind, $key)) {
                return null;
            }

            return $this->conversation->send($conversation->id, [
                'message_type' => 'text',
                'message' => $message,
                'attachments' => array_merge($attachments, ['kind' => $kind]),
            ], $adminId, true);
        } catch (\Throwable $exception) {
            Log::warning('Gagal mengirim notifikasi status ke chat', [
                'buyer_id' => $buyerId,
                'kind' => $kind,
                'notification_key' => $key,
                'error' => $exception->getMessage(),
            ]);

            return null;
        }
    }

    private function notificationSent(int $conversationId, string $kind, string $key): bool
    {
        return ChatMessageModel::query()
            ->where('conversation_id', $conversationId)
            ->where('message_type', 'text')
            ->whereNotNull('attachments')
            ->get()
            ->contains(function (ChatMessageModel $message) use ($kind, $key): bool {
                $attachments = $message->attachments;

                if (($attachments['kind'] ?? null) !== $kind) {
                    return false;
                }

                return $key === '' || ($attachments['notification_key'] ?? null) === $key;
            });
    }

    private function systemAdminId(): ?string
    {
        $adminId = DB::table('users')
            ->join('user_roles', 'user_roles.user_id', '=', 'users.id')
            ->join('roles', 'roles.id', '=', 'user_roles.role_id')
            ->whereIn('roles.name', ['admin', 'super_admin'])
            ->where('roles.is_active', true)
            ->where('users.is_active', true)
            ->whereNull('users.banned_at')
            ->whereNull('users.deleted_at')
            ->orderBy('users.id')
            ->value('users.id');

        return $adminId === null ? null : (string) $adminId;
    }
}
