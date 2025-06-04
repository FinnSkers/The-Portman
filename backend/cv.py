# Handles CV upload, validation, and parsing endpoints
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Body
from typing import List
from pydantic import BaseModel
import os
import shutil
from cv_utils import parse_cv_with_ai
import sys
sys.path.insert(0, os.path.dirname(__file__))
from rag_utils import upsert_cv_embedding, query_similar_professionals, get_professional_benchmark

ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
UPLOAD_DIR = "uploaded_cvs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/cv", tags=["cv"])

def save_upload_file(upload_file, destination):
    with open(destination, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

@router.post("/upload/")
async def upload_cv(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    save_upload_file(file, file_path)
    # Trigger background parsing
    background_tasks.add_task(parse_cv_with_ai, file_path)
    return {"filename": file.filename, "status": "uploaded"}

class ParseCVRequest(BaseModel):
    filename: str

@router.post("/parse/")
async def parse_cv(request: ParseCVRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    result = parse_cv_with_ai(file_path)
    return result

class RAGRequest(BaseModel):
    filename: str
    user_id: str
    embedding: list = []

@router.post("/rag/compare/")
async def rag_compare(request: RAGRequest):
    file_path = os.path.join(UPLOAD_DIR, request.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    
    # Create a proper 1536-dimensional embedding (simulated)
    if not request.embedding or len(request.embedding) < 1536:
        embedding = [0.1] * 1536  # Create proper sized embedding
    else:
        embedding = request.embedding[:1536]  # Truncate if too long
    
    upsert_result = upsert_cv_embedding(request.user_id, embedding)
    similar = query_similar_professionals(embedding)
    benchmark = get_professional_benchmark({"filename": request.filename})
    return {"upsert": upsert_result, "similar_professionals": similar, "benchmark": benchmark}
