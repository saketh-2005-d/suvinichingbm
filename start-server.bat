@echo off
echo.
echo ========================================
echo     NutriPlan Web Server Launcher
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting with Node.js...
    echo.
    node server.js
) else (
    echo Starting with Python...
    echo.
    python server.py
)

pause
