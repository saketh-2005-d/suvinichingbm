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

echo.
echo [2] Starting backend server on port 5000...
echo.
start cmd /k "cd backend && npm start"

echo.
echo [3] Opening client website...
timeout /t 2
if exist client\index.html (
    start client\index.html
) else (
    echo ERROR: Client index.html not found
)

echo.
echo [4] Opening admin panel...
if exist admin\index.html (
    start admin\index.html
) else (
    echo ERROR: Admin index.html not found
)

echo.
echo ================================================
echo Suvini Clothing Application is starting...
echo.
echo Backend Server: http://localhost:5000
echo Client: Open client/index.html in browser
echo Admin: Open admin/index.html in browser
echo.
echo Press Ctrl+C in the backend window to stop server
echo ================================================
echo.
pause
