@echo off
echo Starting Suvini Clothing Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo [2] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3] Starting backend server on port 5000...
echo.
start cmd /k "cd backend && npm start"

echo.
echo [4] Starting frontend dev server on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo [5] Opening frontend website...
timeout /t 3
start http://localhost:5173

echo.
echo ================================================
echo Suvini Clothing Application is starting...
echo.
echo Backend Server: http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin route: http://localhost:5173/admin
echo.
echo Press Ctrl+C in the backend and frontend windows to stop services
echo ================================================
echo.
pause
