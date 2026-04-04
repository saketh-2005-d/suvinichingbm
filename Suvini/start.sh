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

echo "[2] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "[3] Starting backend server on port 5000..."
echo ""

# Start backend server in background
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Start frontend server in background
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for server to start
sleep 3

echo ""
echo "[4] Opening frontend website..."
# Try to open in default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5173 &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5173 &
fi

echo ""
echo "================================================"
echo "Suvini Clothing Application is starting..."
echo ""
echo "Backend Server: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Admin route: http://localhost:5173/admin"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================"
echo ""

# Wait for backend process
wait $BACKEND_PID
wait $FRONTEND_PID
