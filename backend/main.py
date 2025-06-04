# PORTMAN FastAPI Backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cv import router as cv_router
from users import router as users_router
from advanced_rag import router as rag_router
from portfolio import router as portfolio_router

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
