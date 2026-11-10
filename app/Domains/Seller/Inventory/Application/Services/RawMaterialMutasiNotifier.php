<?php

declare(strict_types=1);

namespace App\Domains\Seller\Inventory\Application\Services;

use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ChatMessageModel;
use App\Domains\Communication\Chat\Infrastructure\Persistence\Models\ConversationModel;
use App\Domains\Communication\Chat\Presentation\Events\MessageSent;
use App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel;
use Illuminate\Support\Facades\DB;

/**
 * Kirim notifikasi mutasi bahan baku (surat bukti) ke kotak chat penjual
 * sebagai pesan sistem. Sender dibuat null agar pesan tampil sebagai "Sistem".
 */
final class RawMaterialMutasiNotifier
{
    public function notify(array $data): void
    {
        $store = StoreModel::query()->find((int) $data['store_id']);
        if (! $store || ! $store->user_id) {
            return;
        }

        $message = ChatMessageModel::query()->create([
            'conversation_id' => $this->conversationForStore((int) $store->id, (string) $store->user_id)->id,
            'sender_id' => null,
            'message_type' => 'system',
            'message' => $this->formatMessage($data),
        ])->load(['sender:id,name,avatar', 'conversation.store:id,user_id,name,logo', 'conversation.participants:id']);

        $broadcast = static function () use ($message): void {
            event(new MessageSent($message));
        };

        if (DB::transactionLevel() > 0) {
            DB::afterCommit($broadcast);
        } else {
            $broadcast();
        }
    }

    private function conversationForStore(int $storeId, string $ownerUserId): ConversationModel
    {
        $existing = ConversationModel::query()
            ->where('type', 'system')
            ->where('store_id', $storeId)
            ->where('is_active', true)
            ->whereHas('participants', function ($query) use ($ownerUserId): void {
                $query->where('users.id', $ownerUserId)->whereNull('conversation_participants.left_at');
            })
            ->first();

        if ($existing) {
            return $existing;
        }

        $conversation = ConversationModel::query()->create([
            'type' => 'system',
            'store_id' => $storeId,
            'subject' => 'Notifikasi Bahan Baku',
            'target_role' => 'seller',
            'is_active' => true,
        ]);

        $conversation->participants()->attach([$ownerUserId => ['joined_at' => now()]]);

        return $conversation->refresh();
    }

    private function formatMessage(array $data): string
    {
        $labels = [
            'restock' => 'Restock',
            'usage' => 'Pemakaian',
            'adjustment' => 'Penyesuaian',
            'production_usage' => 'Pemakaian Produksi',
        ];
        $type = strtolower((string) ($data['movement_type'] ?? 'adjustment'));
        $label = $labels[$type] ?? ucfirst($type);
        $unit = trim((string) ($data['unit'] ?? 'pcs')) ?: 'pcs';
        $delta = (float) $data['delta'];
        $balanceAfter = (float) $data['balance_after'];
        $unitCost = (float) $data['unit_cost'];
        $sign = $delta > 0 ? '+' : '';

        $lines = [
            'No. Bukti  : '.trim((string) ($data['reference_number'] ?? '-')),
            'Waktu      : '.((new \DateTimeImmutable((string) ($data['occurred_at'] ?? now())))->format('d-m-Y H:i')),
            'Bahan      : '.mb_strtoupper((string) ($data['material_code'] ?? '')).' - '.trim((string) ($data['material_name'] ?? '-')),
            'Jenis      : '.$label,
            'Perubahan  : '.$sign.$delta.' '.$unit.' (Saldo akhir '.$balanceAfter.' '.$unit.')',
        ];

        if ($unitCost > 0) {
            $lines[] = 'Harga/Unit : Rp '.number_format($unitCost, 0, ',', '.');
            $lines[] = 'Total      : Rp '.number_format(abs($delta) * $unitCost, 0, ',', '.');
        }

        $before = $data['average_cost_before'] ?? null;
        $after = $data['average_cost_after'] ?? null;
        if ($before !== null && $after !== null && abs((float) $after - (float) $before) >= 0.0001) {
            $percent = (float) $before > 0 ? (((float) $after - (float) $before) / (float) $before) * 100 : 100;
            $direction = $after > $before ? 'naik' : 'turun';
            $lines[] = 'Avg Cost   : Rp '.number_format((float) $before, 0, ',', '.').' -> Rp '.number_format((float) $after, 0, ',', '.').' ('.$direction.' '.number_format(abs($percent), 2, ',', '.').'%)';
        }

        $referenceType = trim((string) ($data['reference_type'] ?? 'manual'));
        if ($referenceType !== '') {
            $lines[] = 'Referensi  : '.$referenceType.($data['reference_number'] !== null ? '' : '');
        }
        $notes = trim((string) ($data['notes'] ?? ''));
        if ($notes !== '') {
            $lines[] = 'Catatan    : '.$notes;
        }

        $lines[] = '';
        $lines[] = 'HPP produk yang memakai bahan baku ini dihitung ulang otomatis.';

        return 'BUKTI MUTASI BAHAN BAKU'.PHP_EOL.str_repeat('-', 40).PHP_EOL.implode(PHP_EOL, $lines);
    }
}
