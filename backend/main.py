import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exception_handlers import http_exception_handler
from dotenv import load_dotenv
import logging

# Add the parent directory to sys.path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

app = FastAPI(
    title="PORTMAN Backend API",
    description="AI-powered CV parsing and portfolio generation platform",
    version="2.0.0"
)

# CORS for modern web apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portman-backend")

# Custom 405 handler
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 405:
        return JSONResponse(
            status_code=405,
            content={"error": "Method Not Allowed. Please check the API documentation and use the correct HTTP method (e.g., POST for uploads and parsing)."},
        )
    return await http_exception_handler(request, exc)

@app.get("/")
async def root():
    return {
        "message": "PORTMAN API - Modern AI-Powered Portfolio Maker",
        "version": "2.0.0",
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

# Import and include routers
from backend.cv import router as cv_router
from backend.users import router as users_router
from backend.portfolio import router as portfolio_router
from backend.advanced_rag import router as rag_router
from backend.logs import router as logs_router

app.include_router(cv_router)
app.include_router(users_router)
app.include_router(rag_router)
app.include_router(portfolio_router)
app.include_router(logs_router)
