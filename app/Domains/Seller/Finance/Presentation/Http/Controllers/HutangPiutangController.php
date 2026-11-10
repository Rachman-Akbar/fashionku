<?php

declare(strict_types=1);

namespace App\Domains\Seller\Finance\Presentation\Http\Controllers;

use App\Domains\Seller\Finance\Application\Services\HutangPiutangService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HutangPiutangController extends Controller
{
    public function __construct(
        private HutangPiutangService $service
    ) {}

    public function summary(Request $request): JsonResponse
    {
        $storeId = $request->user()->store->id ?? null;

        if (! $storeId) {
            return response()->json(['success' => false, 'message' => 'Toko tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->getSummary($storeId),
        ]);
    }

    public function aging(Request $request): JsonResponse
    {
        $storeId = $request->user()->store->id ?? null;

        if (! $storeId) {
            return response()->json(['success' => false, 'message' => 'Toko tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->getAging($storeId),
        ]);
    }

    public function detail(Request $request, string $type): JsonResponse
    {
        if (! in_array($type, ['payable', 'receivable'], true)) {
            return response()->json(['success' => false, 'message' => 'Tipe tidak valid.'], 400);
        }

        $storeId = $request->user()->store->id ?? null;

        if (! $storeId) {
            return response()->json(['success' => false, 'message' => 'Toko tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->service->getDetail($storeId, $type),
        ]);
    }

    public function export(Request $request, string $type): Response
    {
        if (! in_array($type, ['payable', 'receivable'], true)) {
            return response('Tipe tidak valid.', 400);
        }

        $storeId = $request->user()->store->id ?? null;

        if (! $storeId) {
            return response('Toko tidak ditemukan.', 404);
        }

        $csv = $this->service->exportReport(
            $storeId,
            $type,
            $request->query('from_date'),
            $request->query('to_date')
        );

        $typeName = $type === 'payable' ? 'Hutang' : 'Piutang';

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="laporan-'.strtolower($typeName).'.csv"',
        ]);
    }
}
