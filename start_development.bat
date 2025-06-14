@echo off
title PORTMAN Development Servers
color 0A

echo =====================================
echo    STARTING PORTMAN DEVELOPMENT
echo =====================================
echo.

echo [INFO] Starting development servers...
echo.

echo [1/2] Starting Backend Server (FastAPI)...
echo Backend will be available at: http://localhost:8000
start "PORTMAN Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [2/2] Starting Frontend Server (Next.js)...
echo Frontend will be available at: http://localhost:3000
start "PORTMAN Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo =====================================
echo    DEVELOPMENT SERVERS STARTED!
echo =====================================
echo.
echo Backend API: http://localhost:8000
echo Frontend:   http://localhost:3000
echo API Docs:   http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul