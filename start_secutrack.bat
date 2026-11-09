@echo off
setlocal EnableDelayedExpansion
title SecuTrack - Start System
color 0A
cd /d "%~dp0"

echo ============================================================================
echo   SECUTRACK - AI-powered Cybersecurity Risk Management System
echo ============================================================================
echo.

REM --- 1. Check Python virtual environment ---
if not exist "backend\.venv\Scripts\python.exe" (
    echo [1/3] Initializing Python backend environment...
    python -m venv backend\.venv
    call backend\.venv\Scripts\pip install -r backend\requirements.txt
) else (
    echo [1/3] Backend Python environment verified.
)

REM --- 2. Check Frontend node_modules ---
if not exist "frontend\node_modules" (
    echo [2/3] Installing frontend dependencies...
    cd frontend && call npm install && cd ..
) else (
    echo [2/3] Frontend node modules verified.
)

REM --- 3. Start Backend & Frontend ---
echo [3/3] Launching SecuTrack Backend (port 5000) and Frontend (port 5173)...
start "SecuTrack Backend API" /min cmd /c "cd backend && .venv\Scripts\python.exe app.py"
start "SecuTrack Frontend" /min cmd /c "cd frontend && npm run dev"

echo.
echo ============================================================================
echo   SecuTrack is starting!
echo   Frontend URL:  http://localhost:5173
echo   Backend API:   http://127.0.0.1:5000/api/health
echo ============================================================================
echo.
timeout /t 3 >nul
start http://localhost:5173
pause

