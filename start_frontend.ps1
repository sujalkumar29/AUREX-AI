Write-Host "==========================================" -ForegroundColor Yellow
Write-Host " Starting AUREX AI Frontend App..." -ForegroundColor Yellow
Write-Host " http://localhost:3000" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Yellow

Set-Location -Path "$PSScriptRoot\frontend"
pnpm dev

