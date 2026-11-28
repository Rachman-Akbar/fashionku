<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TempSchemaProbeTest extends TestCase
{
    use RefreshDatabase;

    public function test_probe(): void
    {
        fwrite(STDERR, 'columns: '.implode(',', Schema::getColumnListing('seller_customers'))."\n");

        foreach (['deleted_at', 'definitely_missing_column'] as $column) {
            try {
                $count = DB::table('seller_customers')->whereNull($column)->count();
                fwrite(STDERR, "whereNull({$column}) ok: {$count}\n");
            } catch (\Throwable $e) {
                fwrite(STDERR, "whereNull({$column}) failed: ".$e->getMessage()."\n");
            }

            try {
                $sql = DB::table('seller_customers')->whereNull($column)->toSql();
                fwrite(STDERR, "sql: {$sql}\n");
            } catch (\Throwable $e) {
                fwrite(STDERR, 'sql failed: '.$e->getMessage()."\n");
            }
        }

        $this->assertTrue(true);
    }
}
