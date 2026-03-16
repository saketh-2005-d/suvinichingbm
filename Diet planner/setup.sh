#!/bin/bash

# Quick Setup Script for Diet Planner - Linux/Mac

echo ""
echo "===================================="
echo "  Diet Planner Pro - Quick Setup"
echo "===================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

echo "[1/4] Creating Python Virtual Environment..."
cd backend
python3 -m venv venv
source venv/bin/activate

echo "[2/4] Installing Dependencies..."
pip install -r requirements.txt

echo "[3/4] Setting up Environment File..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file - please edit it with your OpenAI API key"
fi

echo ""
echo "===================================="
echo "  Setup Complete!"
echo "===================================="
echo ""
echo "NEXT STEPS:"
echo "-----------"
echo "1. Edit backend/.env with your OpenAI API key"
echo "   - Get key from: https://platform.openai.com/api-keys"
echo ""
echo "2. Start the backend server (in backend folder):"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "3. Open frontend/index.html in your web browser"
echo ""
echo "For detailed instructions, see README.md"
echo ""
