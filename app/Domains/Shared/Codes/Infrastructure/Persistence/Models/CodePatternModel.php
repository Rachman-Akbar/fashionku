<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class CodePatternModel extends Model
{
    protected $table = 'code_patterns';

    protected $fillable = ['type', 'pattern'];
}
