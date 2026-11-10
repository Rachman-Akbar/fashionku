<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;

final class CodePatternModel extends Model
{
    protected $table = 'code_patterns';

    protected $fillable = ['store_id', 'type', 'pattern'];

    public function store()
    {
        return $this->belongsTo(\App\Domains\Seller\Stores\Infrastructure\Persistence\Models\StoreModel::class);
    }
}
