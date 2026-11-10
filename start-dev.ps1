# ─── Fashionku Dev Starter ───────────────────────────────────────────────────
# Jalankan script ini dari folder fashionku:
#   .\start-dev.ps1
#
# Script ini akan:
#   1. Matikan semua proses di port 8000, 8080, 5173
#   2. Buka 3 terminal baru (server, reverb, vite)
# ─────────────────────────────────────────────────────────────────────────────

$projectDir = $PSScriptRoot

# ─── 1. Kill semua port yang dipakai ─────────────────────────────────────────
Write-Host "`n[*] Membersihkan port 8000, 8080, 5173..." -ForegroundColor Cyan

@(8000, 8080, 5173) | ForEach-Object {
    $port = $_
    $result = netstat -ano | Select-String ":$port\s" | Where-Object { $_ -match "LISTENING" }
    if ($result) {
        $pid = ($result.ToString().Trim() -split '\s+')[-1]
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  Port $port -> PID $pid dimatikan" -ForegroundColor Yellow
    } else {
        Write-Host "  Port $port -> bebas" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 1

# ─── 2. Buka terminal untuk tiap service ─────────────────────────────────────
Write-Host "`n[*] Membuka terminal untuk setiap service...`n" -ForegroundColor Cyan

# Terminal 1 — Laravel Server (port 8000)
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; Write-Host '[SERVER] php artisan serve' -ForegroundColor Blue; php artisan serve"

Start-Sleep -Milliseconds 500

# Terminal 2 — Laravel Reverb / WebSocket (port 8080)
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; Write-Host '[REVERB] php artisan reverb:start' -ForegroundColor Magenta; php artisan reverb:start --debug"

Start-Sleep -Milliseconds 500

# Terminal 3 — Vite Dev Server (port 5173)
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; Write-Host '[VITE] npm run dev' -ForegroundColor Green; npm run dev"

Start-Sleep -Milliseconds 500

# Terminal 4 — Queue Worker
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; Write-Host '[QUEUE] php artisan queue:listen' -ForegroundColor DarkYellow; php artisan queue:listen --tries=1 --timeout=0"

Write-Host "[OK] Semua terminal dibuka." -ForegroundColor Green
Write-Host ""
Write-Host "  Server  -> http://127.0.0.1:8000" -ForegroundColor Blue
Write-Host "  Vite    -> http://127.0.0.1:5173" -ForegroundColor Green
Write-Host "  Reverb  -> ws://127.0.0.1:8080"   -ForegroundColor Magenta
Write-Host ""
Write-Host "Untuk mematikan semua: jalankan .\stop-dev.ps1" -ForegroundColor Gray
