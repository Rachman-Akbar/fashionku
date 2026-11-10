<?php

declare(strict_types=1);

namespace App\Domains\Order\Payment\Presentation\Http\Controllers;

use App\Domains\Order\Payment\Application\UseCases\HandleMidtransWebhookUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

final class MidtransWebhookController extends Controller
{
    public function __construct(
        private HandleMidtransWebhookUseCase $webhookUseCase,
    ) {}

    public function handleNotification(Request $request): JsonResponse
    {
        try {
            $this->webhookUseCase->execute($request->all());

            return response()->json(['success' => true, 'message' => 'Notifikasi Midtrans berhasil diproses.']);
        } catch (Throwable $exception) {
            Log::warning('Midtrans webhook rejected', [
                'message' => $exception->getMessage(),
                'order_id' => $request->input('order_id'),
                'transaction_status' => $request->input('transaction_status'),
            ]);

            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 400);
        }
    }
}
