Write-Host "==========================================" -ForegroundColor Yellow
Write-Host " Starting AUREX AI Backend API Server..." -ForegroundColor Yellow
Write-Host " The Gold Standard of Brand Integrity" -ForegroundColor DarkGray
Write-Host "==========================================" -ForegroundColor Yellow

Set-Location -Path "$PSScriptRoot\backend"
& ".\venv\Scripts\uvicorn.exe" app.main:app --host 127.0.0.1 --port 8000 --reload

