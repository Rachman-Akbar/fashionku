<?php

declare(strict_types=1);

namespace App\Domains\Shared\Codes\Presentation\Http\Controllers;

use App\Domains\Shared\Codes\Application\Services\CodePatternFormatter;
use App\Domains\Shared\Codes\Application\Services\CodePatternService;
use App\Domains\Shared\Codes\Presentation\Http\Requests\CodePatternRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CodePatternController
{
    public function __construct(private CodePatternService $service) {}

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->resolveStoreId($request);

        return response()->json([
            'success' => true,
            'data' => [
                'patterns' => $this->service->list($storeId),
                'tokens' => CodePatternFormatter::TOKENS,
                'defaults' => CodePatternFormatter::DEFAULTS,
                'store_id' => $storeId,
            ],
        ]);
    }

    public function update(CodePatternRequest $request): JsonResponse
    {
        $storeId = $this->resolveStoreId($request);
        $targetStoreId = $request->user()?->role === 'admin'
            ? $request->input('store_id')
            : $storeId;

        $patterns = $this->service->save(
            (array) $request->input('patterns', []),
            $storeId,
            $targetStoreId === null ? null : (int) $targetStoreId,
        );

        return response()->json([
            'success' => true,
            'message' => 'Rumus kode unik berhasil disimpan.',
            'data' => ['patterns' => $patterns],
        ]);
    }

    public function preview(Request $request): JsonResponse
    {
        $storeId = $this->resolveStoreId($request);
        $type = (string) $request->input('type', 'sku');

        if (! array_key_exists($type, CodePatternFormatter::LABELS)) {
            return response()->json(['success' => false, 'message' => 'Tipe kode tidak dikenal.'], 422);
        }

        $pattern = (string) ($request->input('pattern') ?: $this->service->patternFor($type, $storeId));

        return response()->json([
            'success' => true,
            'data' => [
                'sample' => CodePatternFormatter::render($pattern, $this->previewContext($type, $request)),
            ],
        ]);
    }

    private function previewContext(string $type, Request $request): array
    {
        $context = array_filter([
            'name' => $request->input('name'),
            'brand' => $request->input('brand'),
            'category' => $request->input('category'),
            'store' => $request->input('store'),
            'movement' => $request->input('movement'),
            'status' => $request->input('status'),
        ], fn ($value) => $value !== null && $value !== '');

        if ($type === 'sku' && ! isset($context['name'])) {
            $context['name'] = 'Kecap Manis 600 ml';
        }

        if (in_array($type, ['stock_reference', 'material_reference'], true) && ! isset($context['movement'])) {
            $context['movement'] = 'MASUK';
        }

        return $context;
    }

    private function resolveStoreId(Request $request): ?int
    {
        $user = $request->user();
        if ($user === null) {
            return null;
        }

        if ($user->role === 'admin') {
            $requested = $request->input('store_id');

            return $requested !== null && $requested !== '' ? (int) $requested : null;
        }

        return $user->store_id !== null ? (int) $user->store_id : null;
    }
}
