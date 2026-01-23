@echo off
REM NutriPlan Server Troubleshooting Script
REM This script helps diagnose connection issues

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo   NutriPlan Server Diagnostics
echo ========================================
echo.

REM Check if nutriplan.html exists
echo [1/5] Checking if nutriplan.html exists...
if exist "nutriplan.html" (
    echo ✅ nutriplan.html found
) else (
    echo ❌ nutriplan.html NOT found!
    echo    Make sure you're in the correct directory: c:\codes
    pause
    exit /b 1
)

REM Check if Node.js is installed
echo.
echo [2/5] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo ✅ Node.js !NODE_VER! is installed
) else (
    echo ⚠️  Node.js not found (optional)
    echo    Download from: https://nodejs.org
)

REM Check if Python is installed
echo.
echo [3/5] Checking Python installation...
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PY_VER=%%i
    echo ✅ Python !PY_VER! is installed
) else (
    echo ⚠️  Python not found (optional)
    echo    Download from: https://www.python.org
)

REM Check if port 3000 is available
echo.
echo [4/5] Checking if port 3000 is available...
netstat -ano | findstr ":3000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ❌ Port 3000 is already in use!
    echo    You need to close the app using this port first.
    echo    Or edit server.js to use a different PORT number.
) else (
    echo ✅ Port 3000 is available
)

REM Check internet connectivity
echo.
echo [5/5] Checking internet connectivity...
ping 8.8.8.8 -n 1 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Internet connection is active
) else (
    echo ⚠️  No internet connection detected
    echo    (Local access will still work)
)

echo.
echo ========================================
echo   Starting NutriPlan Server...
echo ========================================
echo.

REM Try to start with Node.js first
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting with Node.js...
    node server.js
) else (
    echo Starting with Python...
    python server.py
)

pause
