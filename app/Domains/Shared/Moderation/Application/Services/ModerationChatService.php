<?php

declare(strict_types=1);

namespace App\Domains\Shared\Moderation\Application\Services;

use App\Domains\Communication\Chat\Application\Services\ConversationService;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class ModerationChatService
{
    public function __construct(private readonly ConversationService $conversation) {}

    /**
     * Kirim pesan moderasi ke dalam chat toko (owner store + admin).
     *
     * @return array{conversation: ConversationModel, message: string}
     */
    public function notifyStoreStatus(int $storeId, string $action, string $actorId, ?string $customMessage = null): array
    {
        $store = DB::table('stores')->where('id', $storeId)->whereNull('deleted_at')->first();
        if (! $store) {
            throw new InvalidArgumentException('Toko untuk notifikasi moderasi tidak ditemukan.');
        }

        $owner = DB::table('users')->where('id', $store->user_id)->whereNull('deleted_at')->first();
        $template = $this->template('store.'.$action);

        $message = $this->render($customMessage ?? $template['message'], [
            '{store_name}' => (string) $store->name,
            '{owner_name}' => (string) ($owner->name ?? 'Seller'),
        ]);

        $conversation = $this->conversation->startModeration([
            'type' => 'store',
            'store_id' => $storeId,
            'subject' => $template['subject'],
        ], $actorId);

        $this->conversation->send($conversation->id, [
            'message_type' => 'text',
            'message' => $message,
        ], $actorId, true);

        return ['conversation' => $conversation, 'message' => $message];
    }

    /**
     * Kirim pesan moderasi ke dalam chat langsung admin -> user.
     *
     * @return array{conversation: ConversationModel, message: string}
     */
    public function notifyUserStatus(string $userId, string $action, string $actorId, ?string $customMessage = null): array
    {
        $user = DB::table('users')->where('id', $userId)->whereNull('deleted_at')->first();
        if (! $user) {
            throw new InvalidArgumentException('User untuk notifikasi moderasi tidak ditemukan.');
        }

        $template = $this->template('user.'.$action);

        $message = $this->render($customMessage ?? $template['message'], [
            '{user_name}' => (string) $user->name,
        ]);

        $conversation = $this->conversation->startModeration([
            'type' => 'direct',
            'subject' => $template['subject'],
            'participant_ids' => [$userId],
        ], $actorId);

        $this->conversation->send($conversation->id, [
            'message_type' => 'text',
            'message' => $message,
        ], $actorId, true);

        return ['conversation' => $conversation, 'message' => $message];
    }

    private function template(string $key): array
    {
        $template = config("moderation_chat.{$key}");
        if (! is_array($template)) {
            throw new InvalidArgumentException("Template pesan moderasi [{$key}] tidak tersedia.");
        }

        return $template;
    }

    private function render(string $message, array $placeholders): string
    {
        return strtr($message, $placeholders);
    }
}
