@echo off
REM Quick Setup Script for Diet Planner - Windows

echo.
echo ====================================
echo   Diet Planner Pro - Quick Setup
echo ====================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Creating Python Virtual Environment...
cd backend
python -m venv venv
call venv\Scripts\activate

echo [2/4] Installing Dependencies...
pip install -r requirements.txt

echo [3/4] Setting up Environment File...
if not exist .env (
    copy .env.example .env
    echo Created .env file - please edit it with your OpenAI API key
)

echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo NEXT STEPS:
echo -----------
echo 1. Edit backend\.env with your OpenAI API key
echo    - Get key from: https://platform.openai.com/api-keys
echo.
echo 2. Start the backend server (in backend folder):
echo    python app.py
echo.
echo 3. Open frontend/index.html in your web browser
echo.
echo For detailed instructions, see README.md
echo.

pause
