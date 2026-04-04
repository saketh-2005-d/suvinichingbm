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
echo [2/4] Installing backend dependencies...
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

REM Install frontend dependencies
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

REM Verify structure
echo [4/4] Verifying project structure...
if not exist frontend\index.html echo ✗ Frontend missing
if not exist backend\server.js echo ✗ Backend missing
if exist frontend\index.html echo ✓ Frontend found
if exist backend\server.js echo ✓ Backend found
echo.

echo ====================================
echo Setup complete!
echo.
echo Next steps:
echo 1. Run: npm start (in backend folder)
echo 2. Run: npm run dev (in frontend folder)
echo 3. Open: http://localhost:5173
echo 4. Admin route: http://localhost:5173/admin
echo ====================================
pause
