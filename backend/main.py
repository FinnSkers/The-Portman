# PORTMAN FastAPI Backend

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.cv import router as cv_router
from backend.users import router as users_router
from backend.portfolio import router as portfolio_router
from backend.advanced_rag import router as rag_router
from backend.logs import router as logs_router
import backend.cv_utils as cv_utils
import requests

app = FastAPI(
    title="PORTMAN Backend API",
    description="AI-powered CV parsing and portfolio generation platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router)
app.include_router(users_router)
app.include_router(rag_router)
app.include_router(portfolio_router)
app.include_router(logs_router)

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "PORTMAN API - AI-Powered Portfolio Maker",
        "version": "1.0.0",
        "status": "operational",
        "features": [
            "CV Upload & Parsing",
            "AI-Powered Data Extraction", 
            "RAG-Based Professional Comparison",
            "Industry Benchmarking",
            "Career Recommendations"
        ],
        "documentation": "/docs"
    }

@app.post("/openrouter-chat")
async def openrouter_chat(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    # Compose OpenRouter API call
    headers = {
        "Authorization": f"Bearer {cv_utils.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": cv_utils.OPENROUTER_MODEL,
        "messages": messages,
        "max_tokens": 256
    }
    try:
        resp = requests.post(cv_utils.OPENROUTER_API_URL, headers=headers, json=data, timeout=30)
        return resp.json()
    except Exception as e:
        return {"message": f"Backend error: {str(e)}"}
