#!/bin/bash
# Quick Start Script for GestureControl Desktop App
# Run this script after npm install to start development

echo "🎉 GestureControl Desktop — Quick Start"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install Node.js v16+"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
fi

echo ""
echo "🚀 Starting GestureControl in development mode..."
echo ""
echo "   - Vite dev server: http://localhost:5173"
echo "   - Electron window will open automatically"
echo "   - Press Ctrl+C to stop"
echo ""

npm run dev-electron

