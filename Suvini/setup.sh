#!/bin/bash
# Suvini Clothing - Quick Setup for Mac/Linux

echo "===================================="
echo "Suvini Clothing - Setup"
echo "===================================="
echo ""

# Check Node.js
echo "[1/3] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found"
echo ""

# Install backend dependencies
echo "[2/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "[3/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

# Verify structure
echo "[4/4] Verifying project structure..."
[ -f frontend/index.html ] && echo "✓ Frontend found" || echo "✗ Frontend missing"
[ -f backend/server.js ] && echo "✓ Backend found" || echo "✗ Backend missing"
echo ""

echo "===================================="
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm start (in backend folder)"
echo "2. Run: npm run dev (in frontend folder)"
echo "3. Open: http://localhost:5173"
echo "4. Admin route: http://localhost:5173/admin"
echo "===================================="
