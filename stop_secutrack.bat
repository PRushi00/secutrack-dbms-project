@echo off
setlocal
title SecuTrack - Stop System
color 0C
cd /d "%~dp0"

echo ============================================================================
echo   SECUTRACK - Stopping processes
echo ============================================================================
echo.

REM Terminate port 5000 and 5173 listeners safely
powershell -Command "Get-NetTCPConnection -LocalPort 5000, 5173 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo SecuTrack backend and frontend processes have been stopped.
echo.
pause

