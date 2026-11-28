<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo 'users columns: '.implode(',', array_map(fn ($c) => $c->Field, DB::select('SHOW COLUMNS FROM users')))."\n";
echo 'addresses columns: '.implode(',', array_map(fn ($c) => $c->Field, DB::select('SHOW COLUMNS FROM addresses')))."\n";

$missing = DB::select(
    'SELECT u.id, u.name, u.email, u.created_at FROM users u
     JOIN user_roles ur ON ur.user_id = u.id
     JOIN roles r ON r.id = ur.role_id AND r.name = ? AND r.deleted_at IS NULL
     LEFT JOIN seller_customers sc ON sc.user_id = u.id
     WHERE sc.user_id IS NULL AND u.deleted_at IS NULL',
    ['buyer']
);

foreach ($missing as $row) {
    echo "missing: {$row->id} | {$row->name} | {$row->email} | {$row->created_at}\n";
}
