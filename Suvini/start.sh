#!/bin/bash

echo "Starting Suvini Clothing Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "[2] Starting backend server on port 5000..."
echo ""

# Start backend server in background
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for server to start
sleep 2

echo ""
echo "[3] Opening client website..."
# Try to open in default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open client/index.html &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open client/index.html &
fi

echo ""
echo "[4] Opening admin panel..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open admin/index.html &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open admin/index.html &
fi

echo ""
echo "================================================"
echo "Suvini Clothing Application is starting..."
echo ""
echo "Backend Server: http://localhost:5000"
echo "Client: Open client/index.html in browser"
echo "Admin: Open admin/index.html in browser"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================"
echo ""

# Wait for backend process
wait $BACKEND_PID
