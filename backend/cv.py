# Handles CV upload, validation, and parsing endpoints
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import os
import shutil
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from ai_services.cv_ai import parse_cv_with_ai
from cv_utils import extract_text_from_file

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
UPLOAD_DIR = "uploaded_cvs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/cv", tags=["cv"])

def save_upload_file(upload_file, destination):
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

@router.post("/upload/", summary="Upload a CV file", response_model=dict)
async def upload_cv(file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    save_upload_file(file, file_path)
    return {"filename": file.filename, "status": "uploaded"}

class ParseCVRequest(BaseModel):
    filename: str

@router.post("/parse/", summary="Parse a CV file with AI", response_model=dict)
async def parse_cv(request: ParseCVRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    text_content = extract_text_from_file(file_path)
    if not text_content.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from file.")
    result = parse_cv_with_ai(text_content)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
