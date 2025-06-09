@echo off
title PORTMAN Development Server
color 0A

echo =====================================
echo    PORTMAN DEVELOPMENT LAUNCHER
echo =====================================
echo.

REM Check if required directories exist
if not exist "backend" (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: Frontend directory not found!
    pause
    exit /b 1
)

echo [INFO] Starting PORTMAN Development Environment...
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server (FastAPI on port 8000)...
start "PORTMAN Backend" cmd /k "cd /d backend && echo Starting Backend Server... && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo [2/2] Starting Frontend Server (Next.js on port 3000)...
start "PORTMAN Frontend" cmd /k "cd /d frontend && echo Starting Frontend Server... && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo =====================================
echo    PORTMAN SERVERS LAUNCHED
echo =====================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open the application in default browser
start http://localhost:3000

echo.
echo Development servers are running in separate windows.
echo Close this window or press Ctrl+C to stop monitoring.
echo.
pause
