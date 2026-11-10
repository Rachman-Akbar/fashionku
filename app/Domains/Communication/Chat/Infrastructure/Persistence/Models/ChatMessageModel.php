<?php

declare(strict_types=1);

namespace App\Domains\Communication\Chat\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ChatMessageModel extends Model
{
    use SoftDeletes;

    protected $table = 'chat_messages';

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message_type',
        'message',
        'attachments',
        'edited_at',
    ];

    protected $casts = [
        'conversation_id' => 'integer',
        'attachments' => 'array',
        'edited_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(ConversationModel::class, 'conversation_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function readers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'chat_message_reads', 'message_id', 'user_id')->withPivot('read_at');
    }
}
