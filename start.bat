@echo off
REM Quick Start Script for GestureControl Desktop App (Windows)
REM Run this script after npm install to start development

echo.
echo 🎉 GestureControl Desktop - Quick Start
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not installed. Please install Node.js v16+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i

echo ✓ Node.js version: %NODE_VER%
echo ✓ npm version: %NPM_VER%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install failed
        exit /b 1
    )
)

echo.
echo 🚀 Starting GestureControl in development mode...
echo.
echo    - Vite dev server: http://localhost:5173
echo    - Electron window will open automatically
echo    - Press Ctrl+C to stop
echo.

call npm run dev-electron
pause

