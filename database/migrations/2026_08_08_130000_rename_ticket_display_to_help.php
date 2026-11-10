<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('support_tickets') && Schema::hasColumn('support_tickets', 'ticket_number')) {
            DB::table('support_tickets')
                ->where('ticket_number', 'like', 'TKT-%')
                ->select(['id', 'ticket_number'])
                ->orderBy('id')
                ->chunkById(200, function ($rows): void {
                    foreach ($rows as $row) {
                        DB::table('support_tickets')
                            ->where('id', $row->id)
                            ->update(['ticket_number' => 'HLP-'.substr((string) $row->ticket_number, 4)]);
                    }
                });
        }

        if (Schema::hasTable('admin_notifications') && Schema::hasColumn('admin_notifications', 'title')) {
            DB::table('admin_notifications')
                ->where('title', 'Ticket bantuan baru')
                ->update(['title' => 'Help baru']);

            DB::table('admin_notifications')
                ->where('title', 'Balasan ticket baru')
                ->update(['title' => 'Balasan Help baru']);
        }

        if (Schema::hasTable('permissions') && Schema::hasColumn('permissions', 'name') && Schema::hasColumn('permissions', 'description')) {
            DB::table('permissions')
                ->where('name', 'tickets.create')
                ->update(['description' => 'Membuat dan membalas Help']);

            DB::table('permissions')
                ->where('name', 'tickets.manage')
                ->update(['description' => 'Mengelola seluruh Help']);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('support_tickets') && Schema::hasColumn('support_tickets', 'ticket_number')) {
            DB::table('support_tickets')
                ->where('ticket_number', 'like', 'HLP-%')
                ->select(['id', 'ticket_number'])
                ->orderBy('id')
                ->chunkById(200, function ($rows): void {
                    foreach ($rows as $row) {
                        DB::table('support_tickets')
                            ->where('id', $row->id)
                            ->update(['ticket_number' => 'TKT-'.substr((string) $row->ticket_number, 4)]);
                    }
                });
        }

        if (Schema::hasTable('admin_notifications') && Schema::hasColumn('admin_notifications', 'title')) {
            DB::table('admin_notifications')
                ->where('title', 'Help baru')
                ->update(['title' => 'Ticket bantuan baru']);

            DB::table('admin_notifications')
                ->where('title', 'Balasan Help baru')
                ->update(['title' => 'Balasan ticket baru']);
        }

        if (Schema::hasTable('permissions') && Schema::hasColumn('permissions', 'name') && Schema::hasColumn('permissions', 'description')) {
            DB::table('permissions')
                ->where('name', 'tickets.create')
                ->update(['description' => 'Membuat dan membalas ticket bantuan']);

            DB::table('permissions')
                ->where('name', 'tickets.manage')
                ->update(['description' => 'Mengelola seluruh ticket bantuan']);
        }
    }
};
