<?php

declare(strict_types=1);

namespace App\Domains\Support\Ticket\Infrastructure\Persistence\Models;

use App\Domains\Identity\User\Domain\Entities\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class SupportTicketMessageModel extends Model
{
    use SoftDeletes;

    protected $table = 'support_ticket_messages';

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
        'attachments',
        'is_internal',
        'read_at',
    ];

    protected $casts = [
        'ticket_id' => 'integer',
        'attachments' => 'array',
        'is_internal' => 'boolean',
        'read_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicketModel::class, 'ticket_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
