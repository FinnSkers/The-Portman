@echo off
echo Starting PORTMAN Backend Server...
cd /d "c:\Users\SAM\Desktop\THE PORTMAN\backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
