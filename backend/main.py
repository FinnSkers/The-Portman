import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

import sys
sys.path.append(os.path.dirname(__file__))
from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exception_handlers import http_exception_handler
import logging
from fastapi.middleware.gzip import GZipMiddleware
from datetime import datetime
from database import engine, SessionLocal, Base

# Import all models so they're registered with Base
from models import User, Portfolio, UploadedFile, UserAnalytics, SystemLog, AIJob, Subscription

# --- APP INITIALIZATION ---
app = FastAPI(
    title="PORTMAN Backend API",
    description="AI-powered CV parsing and portfolio generation platform",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS for modern web apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip middleware for response compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger("portman-backend")

# Models are now imported from models.py
Base.metadata.create_all(bind=engine)

# --- HEALTH CHECK ---
@app.get("/healthz", tags=["system"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

# --- API VERSIONING ---
from fastapi import APIRouter
api_v1_router = APIRouter(prefix="/api/v1")

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Custom exception handler for HTTP exceptions."""
    if exc.status_code == 405:
        return JSONResponse(
            status_code=405,
            content={"error": "Method Not Allowed. Please check the API documentation and use the correct HTTP method (e.g., POST for uploads and parsing)."},
        )
    return await http_exception_handler(request, exc)

@app.get("/")
async def root():
    """Root endpoint providing API information."""
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
from cv import router as cv_router
from users import router as users_router
from portfolio import router as portfolio_router
from advanced_rag import router as rag_router
from logs import router as logs_router
from ats_resume import router as ats_router
from analytics import router as analytics_router
from system_health import router as system_health_router
from additional_endpoints import router as additional_router

# Add routers to api_v1_router instead of app
api_v1_router.include_router(cv_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(rag_router)
api_v1_router.include_router(portfolio_router)
api_v1_router.include_router(logs_router)
api_v1_router.include_router(ats_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(additional_router)

# Add system health router directly to app (not under /api/v1)
app.include_router(system_health_router)
app.include_router(api_v1_router)

# Remove all __pycache__ and .pyc files from version control and deployment
# Add this to .gitignore if not already present
# __pycache__/
# *.pyc
# uploaded_cvs/
