<?php

declare(strict_types=1);

namespace Tests\Feature\Support;

use App\Domains\Identity\User\Domain\Entities\User;
use App\Domains\Support\Ticket\Infrastructure\Persistence\Models\SupportTicketModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

/**
 * Endpoint PATCH /api/v1/support/tickets/{id}/status — halaman Help admin.
 *
 * Selain mengubah status, endpoint ini satu-satunya jalur penugasan (`assigned_to`).
 * Tiket dibuat langsung lewat model supaya satu test cukup memakai satu role aktif
 * (guard Sanctum menyimpan user pertama pada satu application instance).
 */
class TicketAssignmentTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeRole('admin');
        $this->makeRole('buyer');
        $this->grantPermissions('admin', ['tickets.manage']);
        $this->grantPermissions('buyer', ['tickets.create']);
    }

    private function grantPermissions(string $roleName, array $names): void
    {
        $roleId = DB::table('roles')->where('name', $roleName)->whereNull('deleted_at')->value('id');
        $now = now();

        foreach ($names as $name) {
            $permissionId = DB::table('permissions')->where('name', $name)->whereNull('deleted_at')->value('id')
                ?? DB::table('permissions')->insertGetId([
                    'name' => $name,
                    'description' => $name,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

            DB::table('role_permissions')->insertOrIgnore([
                'role_id' => $roleId,
                'permission_id' => $permissionId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    private function makeTicket(): SupportTicketModel
    {
        $buyer = $this->makeUser(['name' => 'Pembeli Uji'], ['buyer']);

        return SupportTicketModel::query()->create([
            'ticket_number' => 'HLP-TEST-'.strtoupper(uniqid()),
            'user_id' => $buyer->id,
            'category' => 'other',
            'subject' => 'Paket belum sampai',
            'description' => 'Pesanan saya belum dikirim.',
            'priority' => 'normal',
            'status' => 'open',
            'last_replied_at' => now(),
            'is_active' => true,
        ]);
    }

    public function test_admin_can_assign_and_unassign_ticket(): void
    {
        $ticket = $this->makeTicket();

        $admin = $this->actingAsRole('admin');
        $secondAdmin = $this->makeUser(['name' => 'Admin Kedua'], ['admin']);

        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'in_progress',
            'assigned_to' => $secondAdmin->id,
        ])->assertOk()
            ->assertJsonPath('data.status', 'in_progress')
            ->assertJsonPath('data.assigned_to', (string) $secondAdmin->id)
            ->assertJsonPath('data.assigned_name', 'Admin Kedua');

        $this->assertDatabaseHas('support_tickets', [
            'id' => $ticket->id,
            'assigned_to' => $secondAdmin->id,
        ]);

        // assigned_to null eksplisit harus melepas penugasan, bukan kembali ke aktor.
        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'in_progress',
            'assigned_to' => null,
        ])->assertOk()
            ->assertJsonPath('data.assigned_to', null)
            ->assertJsonPath('data.assigned_name', null);

        // Tanpa assigned_to: penugasan kosong diisi aktor (perilaku lama dipertahankan).
        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'resolved',
        ])->assertOk()
            ->assertJsonPath('data.status', 'resolved')
            ->assertJsonPath('data.assigned_to', (string) $admin->id);

        $this->assertDatabaseHas('support_tickets', [
            'id' => $ticket->id,
            'status' => 'resolved',
            'assigned_to' => $admin->id,
        ]);
    }

    public function test_status_update_keeps_existing_assignee(): void
    {
        $ticket = $this->makeTicket();
        $assignee = $this->makeUser(['name' => 'Penanggung Jawab'], ['admin']);

        SupportTicketModel::query()->whereKey($ticket->id)->update(['assigned_to' => $assignee->id]);

        $this->actingAsRole('admin');

        // Admin mengubah status tanpa mengirim assigned_to → penanggung jawab tetap.
        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'closed',
        ])->assertOk()
            ->assertJsonPath('data.assigned_to', (string) $assignee->id)
            ->assertJsonPath('data.assigned_name', 'Penanggung Jawab');
    }

    public function test_non_admin_cannot_assign_ticket(): void
    {
        $ticket = $this->makeTicket();

        $this->actingAsRole('buyer');

        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'in_progress',
        ])->assertForbidden();
    }

    public function test_assign_requires_existing_user(): void
    {
        $ticket = $this->makeTicket();

        $this->actingAsRole('admin');

        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'in_progress',
            'assigned_to' => '00000000-0000-0000-0000-000000000000',
        ])->assertStatus(422)->assertJsonValidationErrors('assigned_to');
    }

    public function test_admin_can_assign(): void
    {
        $ticket = $this->makeTicket();

        $admin = $this->makeUser(['name' => 'Admin Panel Seller'], ['admin']);
        $this->withToken($this->tokenFor($admin, 'admin'));

        $assignee = $this->makeUser(['name' => 'Admin Penanggung Jawab'], ['admin']);

        $this->patchJson("/api/v1/support/tickets/{$ticket->id}/status", [
            'status' => 'in_progress',
            'assigned_to' => $assignee->id,
        ])->assertOk()
            ->assertJsonPath('data.assigned_name', 'Admin Penanggung Jawab');
    }

    public function test_admin_list_returns_assignee_name(): void
    {
        $ticket = $this->makeTicket();
        $assignee = $this->makeUser(['name' => 'Operator Toko'], ['admin']);

        SupportTicketModel::query()->whereKey($ticket->id)->update(['assigned_to' => $assignee->id]);

        $this->actingAsRole('admin');

        $response = $this->getJson('/api/v1/support/tickets?per_page=20')->assertOk();

        $row = collect($response->json('data'))->firstWhere('id', $ticket->id);

        $this->assertNotNull($row, 'Tiket tidak ditemukan pada list admin.');
        $this->assertSame('Operator Toko', $row['assigned_name'] ?? null);
    }
}
