# Quick Backend Health Check
# Usage: .\scripts\quick-backend-check.ps1

Write-Host "`n=== DigitalOcean Backend Health Check ===" -ForegroundColor Cyan

# 1. Check Health
Write-Host "`n1. Health Status:" -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "https://www.thequoteshub.info/health" -UseBasicParsing | ConvertFrom-Json
    Write-Host "   ✓ Status: $($health.status)" -ForegroundColor Green
    Write-Host "   ✓ Version: $($health.version)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Check ML Models
Write-Host "`n2. ML Models Status:" -ForegroundColor Yellow
try {
    $status = Invoke-WebRequest -Uri "https://www.thequoteshub.info/status" -UseBasicParsing | ConvertFrom-Json
    Write-Host "   Models Loaded: $($status.ml_models.loaded_models)/$($status.ml_models.total_models)" -ForegroundColor $(if($status.ml_models.loaded_models -eq $status.ml_models.total_models){'Green'}else{'Yellow'})
    Write-Host "   Readiness: $($status.ml_models.readiness_percentage)%" -ForegroundColor $(if($status.ml_models.readiness_percentage -eq 100){'Green'}else{'Yellow'})
    Write-Host "   Redis Cache: $($status.redis.status)" -ForegroundColor Green
    
    if ($status.ml_models.readiness_percentage -lt 100) {
        Write-Host "`n   ⚠ WARNING: Not all models loaded yet!" -ForegroundColor Yellow
        Write-Host "   This can cause slower responses or timeouts." -ForegroundColor Yellow
        Write-Host "   Models typically take 2-5 minutes to fully load after server restart." -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Performance Test
Write-Host "`n3. Performance Test (3 requests):" -ForegroundColor Yellow
$times = @()
for($i=1; $i -le 3; $i++) {
    try {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $body = '{"text":"test","compact_mode":true}'
        $result = Invoke-WebRequest -Uri "https://www.thequoteshub.info/analyze" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 20 -UseBasicParsing
        $sw.Stop()
        $times += $sw.ElapsedMilliseconds
        Write-Host "   Request $i : $($sw.ElapsedMilliseconds)ms" -ForegroundColor Green
        Start-Sleep -Milliseconds 500
    } catch {
        Write-Host "   Request $i : FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($times.Count -gt 0) {
    $avg = ($times | Measure-Object -Average).Average
    Write-Host "`n   Average: $([math]::Round($avg))ms" -ForegroundColor Cyan
    
    if ($avg -lt 2000) {
        Write-Host "   ✓ Performance: EXCELLENT" -ForegroundColor Green
    } elseif ($avg -lt 5000) {
        Write-Host "   ✓ Performance: GOOD" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠ Performance: SLOW (check models status)" -ForegroundColor Red
    }
}

# 4. Recommendations
Write-Host "`n4. Recommendations:" -ForegroundColor Yellow

if ($status.ml_models.readiness_percentage -lt 100) {
    Write-Host "   • Wait for all ML models to load (currently $($status.ml_models.readiness_percentage)%)" -ForegroundColor Yellow
    Write-Host "   • Consider implementing model lazy loading" -ForegroundColor Gray
    Write-Host "   • Check DigitalOcean droplet memory usage" -ForegroundColor Gray
} else {
    Write-Host "   ✓ All models loaded - System ready!" -ForegroundColor Green
}

if ($avg -gt 3000) {
    Write-Host "   • Consider upgrading DigitalOcean droplet size" -ForegroundColor Yellow
    Write-Host "   • Enable Redis caching (if not already)" -ForegroundColor Yellow
    Write-Host "   • Review ML model optimization" -ForegroundColor Gray
}

Write-Host "`n=== End of Check ===" -ForegroundColor Cyan
Write-Host ""
