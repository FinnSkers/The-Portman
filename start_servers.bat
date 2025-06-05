@echo off
REM PORTMAN: Start Backend and Frontend

REM Set project root
cd /d "%~dp0"

REM Detect venv Python, fallback to system Python
set "VENV_PYTHON=%~dp0venv\Scripts\python.exe"
if exist "%VENV_PYTHON%" (
    set "PYTHON_CMD=%VENV_PYTHON%"
) else (
    set "PYTHON_CMD=python"
)

REM Start FastAPI backend (module mode for relative imports)
start powershell -NoExit -Command "$env:PYTHONPATH = 'C:\Users\SAM\Desktop\THE PORTMAN'; python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

REM Start Next.js frontend
start powershell -NoExit -Command "cd frontend; npx next dev"

echo Backend and frontend servers started in new PowerShell windows.
pause
