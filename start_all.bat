@echo off
echo ========================================================
echo  Launching AUREX AI Platform (Backend + Frontend)
echo  The Gold Standard of Brand Integrity
echo ========================================================
start "Aurex AI Backend (FastAPI)" cmd /k "cd /d %~dp0backend && venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 >nul
start "Aurex AI Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && pnpm dev"
echo Both services launched!
echo Access the application at: http://localhost:3000
echo API Documentation at: http://127.0.0.1:8000/docs
pause

