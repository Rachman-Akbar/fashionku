<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Domains\Order\Voucher\Domain\Entities\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\Support\InteractsAsUser;
use Tests\TestCase;

class VoucherCrudTest extends TestCase
{
    use InteractsAsUser;
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'voucher_scope' => 'store',
            'code' => 'SALE10',
            'name' => 'Diskon 10%',
            'discount_target' => 'product',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_spend' => 50000,
            'max_discount' => 20000,
            'starts_at' => '2026-08-01 00:00:00',
            'ends_at' => '2026-12-31 23:59:59',
            'usage_limit' => 100,
            'is_active' => 1,
        ], $overrides);
    }

    public function test_seller_can_create_list_update_and_delete_voucher(): void
    {
        $this->actingAsSeller();

        $create = $this->postJson('/api/v1/order/vouchers/seller', $this->payload());
        $create->assertCreated();
        $create->assertJsonPath('success', true);
        $id = $create->json('data.id');
        $this->assertNotNull($id);
        $this->assertSame('sale10', Voucher::query()->find($id)->code);

        $this->getJson('/api/v1/order/vouchers/seller/manage/list')
            ->assertOk()
            ->assertJsonPath('success', true);

        $update = $this->putJson("/api/v1/order/vouchers/seller/{$id}", $this->payload([
            'code' => 'SALE20',
            'name' => 'Diskon 20%',
            'discount_value' => 20,
        ]));
        $update->assertOk();
        $this->assertSame('sale20', Voucher::query()->find($id)->code);
        $this->assertSame('Diskon 20%', Voucher::query()->find($id)->name);

        $this->deleteJson("/api/v1/order/vouchers/seller/{$id}")->assertOk();
        $this->assertSoftDeleted('vouchers', ['id' => $id]);
    }

    public function test_create_validates_required_fields(): void
    {
        $this->actingAsSeller();

        $this->postJson('/api/v1/order/vouchers/seller', [
            'code' => 'X',
        ])->assertStatus(422);
    }

    public function test_buyer_cannot_manage_vouchers(): void
    {
        $this->actingAsRole('buyer');

        $this->getJson('/api/v1/order/vouchers/seller/manage/list')->assertForbidden();
        $this->postJson('/api/v1/order/vouchers/seller', $this->payload())->assertForbidden();
    }

    public function test_seller_cannot_create_duplicate_voucher_code(): void
    {
        $this->actingAsSeller();

        $this->postJson('/api/v1/order/vouchers/seller', $this->payload(['code' => 'DUP1']))->assertCreated();
        $this->postJson('/api/v1/order/vouchers/seller', $this->payload(['code' => 'DUP1']))->assertStatus(422);
    }

    public function test_buyer_can_list_and_claim_owned_vouchers(): void
    {
        $user = $this->makeUser([], ['buyer']);
        Sanctum::actingAs($user, ['access-api', 'active-role:buyer']);

        $voucher = Voucher::query()->create([
            'voucher_scope' => 'platform',
            'code' => 'CLAIM1',
            'name' => 'Voucher Klaim',
            'discount_target' => 'product',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_spend' => 0,
            'starts_at' => '2026-01-01 00:00:00',
            'ends_at' => '2026-12-31 23:59:59',
            'usage_limit' => 0,
            'is_active' => true,
        ]);

        $userVoucherId = DB::table('user_vouchers')->insertGetId([
            'user_id' => $user->id,
            'voucher_id' => $voucher->id,
            'source_type' => 'manual',
            'source_id' => '999',
            'status' => 'available',
            'claimed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->getJson('/api/v1/order/vouchers/mine')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.voucher.code', 'claim1')
            ->assertJsonPath('data.0.status', 'available')
            ->assertJsonPath('meta.total', 1);

        $claim = $this->postJson("/api/v1/order/vouchers/{$userVoucherId}/claim");
        $claim->assertOk();
        $claim->assertJsonPath('success', true);
        $claim->assertJsonPath('data.voucher.code', 'claim1');
        $claim->assertJsonPath('data.status', 'claimed');

        $this->getJson('/api/v1/order/vouchers/mine')
            ->assertJsonPath('data.0.status', 'claimed');

        $this->postJson('/api/v1/order/vouchers/999999/claim')->assertStatus(404);
    }
}
