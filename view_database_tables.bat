@echo off
setlocal EnableDelayedExpansion
title SecuTrack - Database Table Inspector
color 0B
cd /d "%~dp0"

echo ============================================================================
echo   SECUTRACK - Database Table Inspector (Read-Only)
echo ============================================================================
echo.

REM --- 1. Verify Configured Database File ---
if not exist "backend\secutrack.db" (
    color 0C
    echo [ERROR] Configured SecuTrack database file not found:
    echo         "%~dp0backend\secutrack.db"
    echo.
    echo Please verify that the database exists before inspecting.
    echo.
    pause
    exit /b 1
)

REM --- 2. Locate Python Runtime ---
set "PYTHON_EXE="
if exist "backend\.venv\Scripts\python.exe" (
    set "PYTHON_EXE=backend\.venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXE=python"
    )
)

if not defined PYTHON_EXE (
    color 0C
    echo [ERROR] Python runtime not detected!
    echo         Neither 'backend\.venv\Scripts\python.exe' nor system 'python' was found.
    echo.
    echo Python is required to run the read-only SQLite database inspection utility.
    echo.
    pause
    exit /b 1
)

REM --- 3. Verify Helper Script ---
if not exist "backend\inspect_db.py" (
    color 0C
    echo [ERROR] Helper script 'backend\inspect_db.py' not found!
    echo.
    pause
    exit /b 1
)

REM --- 4. Launch Inspector Utility ---
"%PYTHON_EXE%" "backend\inspect_db.py" %*
set "EXIT_CODE=%errorlevel%"

if %EXIT_CODE% neq 0 (
    echo.
    echo [NOTICE] Inspector process exited with code %EXIT_CODE%.
    echo.
)

pause
exit /b %EXIT_CODE%

