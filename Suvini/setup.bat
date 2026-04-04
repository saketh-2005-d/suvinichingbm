@echo off
REM Suvini Clothing - Quick Setup for Windows
REM This script installs all dependencies

echo ====================================
echo Suvini Clothing - Setup
echo ====================================
echo.

REM Check Node.js
echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

REM Install backend dependencies
echo [2/3] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

REM Verify structure
echo [3/3] Verifying project structure...
if not exist client\index.html echo ✗ Client missing
if not exist admin\index.html echo ✗ Admin missing
if exist client\index.html echo ✓ Client found
if exist admin\index.html echo ✓ Admin found
echo.

echo ====================================
echo Setup complete!
echo.
echo Next steps:
echo 1. Run: npm start (in backend folder)
echo 2. Open: client/index.html
echo 3. Open: admin/index.html
echo.
echo For detailed instructions, see QUICKSTART.md
echo ====================================
pause
