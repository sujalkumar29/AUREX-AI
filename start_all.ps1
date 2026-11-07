Write-Host "========================================================" -ForegroundColor Yellow
Write-Host " Launching AUREX AI Platform (Backend + Frontend)" -ForegroundColor Yellow
Write-Host " The Gold Standard of Brand Integrity" -ForegroundColor DarkGray
Write-Host "========================================================" -ForegroundColor Yellow

$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; .\venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; pnpm dev"

Write-Host "`nPlatform running successfully!" -ForegroundColor Green
Write-Host "Frontend Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend REST API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Cyan

