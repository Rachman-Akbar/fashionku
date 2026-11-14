<?php

declare(strict_types=1);

namespace App\Domains\Shared\Settings\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class AppSettingModel extends Model
{
    protected $table = 'app_settings';

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
    ];
}
