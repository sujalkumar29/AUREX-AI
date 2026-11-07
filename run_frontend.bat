@echo off
echo ==========================================
echo  Starting AUREX AI Frontend App...
echo  http://localhost:3000
echo ==========================================
cd /d "%~dp0frontend"
call pnpm dev
pause

