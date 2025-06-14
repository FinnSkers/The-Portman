@echo off
title PORTMAN Setup Script
color 0B

echo =====================================
echo    PORTMAN INITIAL SETUP
echo =====================================
echo.

echo [INFO] Setting up PORTMAN development environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo [1/4] Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo [2/4] Installing frontend dependencies...
cd frontend
npm install
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo [3/4] Installing backend dependencies...
cd backend
pip install -r requirements.txt
pip install python-jose[cryptography] passlib[bcrypt]
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo [4/4] Initializing database...
python init_database.py
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)

python create_admin.py
cd ..

echo.
echo =====================================
echo    SETUP COMPLETE!
echo =====================================
echo.
echo You can now start the development servers by running:
echo start_portman_dev.bat
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
echo Please change the admin password after first login!
echo.
pause
