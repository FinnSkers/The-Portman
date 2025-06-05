from fastapi import APIRouter, Request
import os
from datetime import datetime

router = APIRouter()

LOG_FILE = os.path.join(os.path.dirname(__file__), '../all-logs.log')

@router.post("/logs")
async def log_event(request: Request):
    data = await request.json()
    timestamp = datetime.utcnow().isoformat()
    entry = {"timestamp": timestamp, **data}
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"{entry}\n")
        return {"status": "logged"}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/logs")
async def get_logs():
    try:
        if not os.path.exists(LOG_FILE):
            return {"logs": []}
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
        logs = [eval(line) for line in lines if line.strip()]
        return {"logs": logs}
    except Exception as e:
        return {"logs": [], "error": str(e)}
