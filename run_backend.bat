@echo off
echo ==========================================
echo  Starting AUREX AI Backend API Server...
echo  The Gold Standard of Brand Integrity
echo ==========================================
cd /d "%~dp0backend"
call "venv\Scripts\uvicorn.exe" app.main:app --host 127.0.0.1 --port 8000 --reload
pause

