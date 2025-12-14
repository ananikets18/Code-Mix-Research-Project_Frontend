# Backend Health Check Script
# Usage: .\scripts\check-backend-health.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Backend Health Diagnostic Tool" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$endpoints = @{
    "Direct Backend Health" = "https://www.thequoteshub.info/health"
    "Direct Backend Analyze" = "https://www.thequoteshub.info/analyze"
    "Netlify Proxy Analyze" = "https://code-mix-for-social-media.netlify.app/api/analyze"
    "Direct Backend Status" = "https://www.thequoteshub.info/status"
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "Get",
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 20
            UseBasicParsing = $true
            ErrorAction = 'Stop'
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        $sw.Stop()
        
        Write-Host "✓ Status: $($response.StatusCode) - $($response.StatusDescription)" -ForegroundColor Green
        Write-Host "✓ Response Time: $($sw.ElapsedMilliseconds)ms" -ForegroundColor Green
        
        # Performance warnings
        if ($sw.ElapsedMilliseconds -gt 10000) {
            Write-Host "⚠ WARNING: Very slow response (>10s)" -ForegroundColor Red
        } elseif ($sw.ElapsedMilliseconds -gt 5000) {
            Write-Host "⚠ WARNING: Slow response (>5s)" -ForegroundColor Yellow
        } elseif ($sw.ElapsedMilliseconds -gt 2000) {
            Write-Host "ℹ INFO: Moderate response time (>2s)" -ForegroundColor DarkYellow
        }
        
        # Show content preview for small responses
        if ($response.Content.Length -lt 500) {
            Write-Host "Response Preview: $($response.Content)" -ForegroundColor Gray
        } else {
            Write-Host "Response Size: $($response.Content.Length) bytes" -ForegroundColor Gray
        }
        
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Time = $sw.ElapsedMilliseconds
        }
    }
    catch {
        if ($sw) { $sw.Stop() }
        Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
        
        return @{
            Success = $false
            Error = $_.Exception.Message
            Time = if ($sw) { $sw.ElapsedMilliseconds } else { 0 }
        }
    }
    finally {
        Write-Host "`n" -NoNewline
    }
}

# Test Health Endpoint
$healthResult = Test-Endpoint -Name "Health Check" -Url $endpoints["Direct Backend Health"]

# Test Analyze Endpoint (Direct)
$testBody = @{ 
    text = "This is a test message for health check" 
    compact_mode = $true 
} | ConvertTo-Json

$analyzeDirectResult = Test-Endpoint `
    -Name "Analyze Endpoint (Direct)" `
    -Url $endpoints["Direct Backend Analyze"] `
    -Method Post `
    -Body $testBody

# Test Analyze Endpoint (via Netlify Proxy)
$analyzeProxyResult = Test-Endpoint `
    -Name "Analyze Endpoint (Netlify Proxy)" `
    -Url $endpoints["Netlify Proxy Analyze"] `
    -Method Post `
    -Body $testBody

# Test Status Endpoint
$statusResult = Test-Endpoint -Name "Status Endpoint" -Url $endpoints["Direct Backend Status"]

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$allTests = @(
    @{ Name = "Health Endpoint"; Result = $healthResult }
    @{ Name = "Direct Analyze"; Result = $analyzeDirectResult }
    @{ Name = "Proxy Analyze"; Result = $analyzeProxyResult }
    @{ Name = "Status Endpoint"; Result = $statusResult }
)

$passedTests = ($allTests | Where-Object { $_.Result.Success }).Count
$totalTests = $allTests.Count

Write-Host "`nTests Passed: $passedTests / $totalTests" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

foreach ($test in $allTests) {
    $icon = if ($test.Result.Success) { "✓" } else { "✗" }
    $color = if ($test.Result.Success) { "Green" } else { "Red" }
    $time = if ($test.Result.Time) { "$($test.Result.Time)ms" } else { "N/A" }
    
    Write-Host "$icon $($test.Name): " -NoNewline -ForegroundColor $color
    if ($test.Result.Success) {
        Write-Host "$time" -ForegroundColor Gray
    } else {
        Write-Host "$($test.Result.Error)" -ForegroundColor Red
    }
}

# Performance Comparison
if ($analyzeDirectResult.Success -and $analyzeProxyResult.Success) {
    Write-Host "`n--- Performance Comparison ---" -ForegroundColor Cyan
    Write-Host "Direct Backend: $($analyzeDirectResult.Time)ms"
    Write-Host "Netlify Proxy:  $($analyzeProxyResult.Time)ms"
    
    $difference = $analyzeProxyResult.Time - $analyzeDirectResult.Time
    if ($difference -gt 0) {
        Write-Host "Proxy is slower by $([math]::Abs($difference))ms" -ForegroundColor Yellow
    } else {
        Write-Host "Proxy is faster by $([math]::Abs($difference))ms (caching)" -ForegroundColor Green
    }
}

# Recommendations
Write-Host "`n--- Recommendations ---" -ForegroundColor Cyan
if ($passedTests -eq $totalTests) {
    Write-Host "✓ All systems operational!" -ForegroundColor Green
    
    $avgTime = ($allTests | Where-Object { $_.Result.Success } | ForEach-Object { $_.Result.Time } | Measure-Object -Average).Average
    
    if ($avgTime -gt 3000) {
        Write-Host "⚠ Consider optimizing backend performance (avg: $([math]::Round($avgTime))ms)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Some endpoints are failing:" -ForegroundColor Red
    $allTests | Where-Object { -not $_.Result.Success } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Result.Error)" -ForegroundColor Red
    }
    
    Write-Host "`nTroubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Check if backend server is running"
    Write-Host "2. Verify DNS resolution for thequoteshub.info"
    Write-Host "3. Check firewall/network connectivity"
    Write-Host "4. Review backend server logs"
    Write-Host "5. Test with: curl https://www.thequoteshub.info/health"
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
