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
echo "[2/3] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Verify structure
echo "[3/3] Verifying project structure..."
[ -f client/index.html ] && echo "✓ Client found" || echo "✗ Client missing"
[ -f admin/index.html ] && echo "✓ Admin found" || echo "✗ Admin missing"
echo ""

echo "===================================="
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm start (in backend folder)"
echo "2. Open: client/index.html"
echo "3. Open: admin/index.html"
echo ""
echo "For detailed instructions, see QUICKSTART.md"
echo "===================================="
