@echo off
echo Starting PORTMAN Modern Backend...
cd /d "c:\Users\SAM\Desktop\THE PORTMAN\backend"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
pause
