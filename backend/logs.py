from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from models import SystemLog, User
from database import SessionLocal
from auth_utils import get_current_user
import os
import json
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/logs", tags=["logs"])

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Legacy log file for backwards compatibility
LOG_FILE = os.path.join(os.path.dirname(__file__), '../all-logs.log')

@router.post("/")
async def create_log_entry(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Create a new log entry"""
    try:
        data = await request.json()
        
        # Create database log entry
        log_entry = SystemLog(
            level=data.get('level', 'INFO'),
            message=data.get('message', ''),
            module=data.get('module', 'unknown'),
            user_id=current_user.id if current_user else None,
            timestamp=datetime.utcnow(),
            extra_data=data.get('extra_data', {})
        )
        
        db.add(log_entry)
        db.commit()
        
        # Also write to file for backwards compatibility
        timestamp = datetime.utcnow().isoformat()
        entry = {"timestamp": timestamp, **data}
        try:
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(f"{json.dumps(entry)}\n")
        except Exception as file_error:
            print(f"Warning: Could not write to log file: {file_error}")
        
        return {"status": "logged", "id": log_entry.id}
        
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/")
async def get_logs(
    limit: int = 100,
    level: Optional[str] = None,
    module: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get log entries from database"""
    try:
        query = db.query(SystemLog)
        
        if level:
            query = query.filter(SystemLog.level == level)
        if module:
            query = query.filter(SystemLog.module == module)
            
        logs = query.order_by(SystemLog.timestamp.desc()).limit(limit).all()
        
        return {
            "logs": [
                {
                    "id": log.id,
                    "level": log.level,
                    "message": log.message,
                    "module": log.module,
                    "user_id": log.user_id,
                    "timestamp": log.timestamp.isoformat() if log.timestamp is not None else None,
                    "extra_data": log.extra_data
                }
                for log in logs
            ]
        }
        
    except Exception as e:
        return {"logs": [], "error": str(e)}

@router.get("/file")
async def get_logs_from_file(current_user: User = Depends(get_current_user)):
    """Get logs from legacy file (admin only)"""
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
        
    try:
        if not os.path.exists(LOG_FILE):
            return {"logs": []}
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
        logs = []
        for line in lines:
            if line.strip():
                try:
                    logs.append(json.loads(line))
                except json.JSONDecodeError:
                    # Skip malformed lines
                    continue
        return {"logs": logs}
    except Exception as e:
        return {"logs": [], "error": str(e)}
