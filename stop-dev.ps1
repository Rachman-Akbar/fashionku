# ─── Fashionku Dev Stopper ───────────────────────────────────────────────────
# Matikan semua proses dev: port 8000, 8080, 5173 + queue worker
# Jalankan: .\stop-dev.ps1
# ─────────────────────────────────────────────────────────────────────────────

Write-Host "`n[*] Mematikan semua service dev Fashionku..." -ForegroundColor Cyan

# Kill by port
@(8000, 8080, 5173) | ForEach-Object {
    $port = $_
    $result = netstat -ano | Select-String ":$port\s" | Where-Object { $_ -match "LISTENING" }
    if ($result) {
        $pid = ($result.ToString().Trim() -split '\s+')[-1]
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  Port $port (PID $pid) -> dimatikan" -ForegroundColor Yellow
    } else {
        Write-Host "  Port $port -> sudah bebas" -ForegroundColor Green
    }
}

# Kill queue listener (php artisan queue:listen tidak pakai port)
Get-Process php -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  PHP PID $($_.Id) -> dimatikan" -ForegroundColor Yellow
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# Kill node (vite)
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Node PID $($_.Id) -> dimatikan" -ForegroundColor Yellow
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "`n[OK] Semua service dimatikan. Port 8000, 8080, 5173 bebas.`n" -ForegroundColor Green
