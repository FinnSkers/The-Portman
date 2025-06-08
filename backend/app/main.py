"""
Modern FastAPI application factory with comprehensive middleware and configuration.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
# from app.core.logging import logger  # Temporarily commented out
from app.api.v1.api import api_router

# Simple logger for now
import logging
logger = logging.getLogger("portman")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan management."""
    logger.info("Starting PORTMAN Backend", extra={"version": settings.version})
    
    # Initialize database
    try:
        from app.core.database import engine, Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.warning(f"Database initialization failed: {e}")
    
    yield
    
    logger.info("Shutting down PORTMAN Backend")


def create_application() -> FastAPI:
    """Create and configure FastAPI application."""
    
    app = FastAPI(
        title=settings.app_name,
        description="AI-powered CV parsing, portfolio generation, and ATS resume optimization platform",
        version=settings.version,
        docs_url=settings.docs_url if settings.debug else None,
        redoc_url=settings.redoc_url if settings.debug else None,
        openapi_url=settings.openapi_url if settings.debug else None,
        lifespan=lifespan,
    )
    
    # Add middleware
    configure_middleware(app)
    
    # Add exception handlers
    configure_exception_handlers(app)
    
    # Include API routes
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    
    return app


def configure_middleware(app: FastAPI) -> None:
    """Configure application middleware."""
    
    # Trusted hosts middleware (security)
    if not settings.debug:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["portman.app", "*.portman.app", "localhost"]
        )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.cors_origins],
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )
    
    # Session middleware
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.secret_key,
        max_age=86400,  # 24 hours
    )
    
    # GZip compression middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)


def configure_exception_handlers(app: FastAPI) -> None:
    """Configure custom exception handlers."""
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """Handle HTTP exceptions."""
        logger.error(
            "HTTP exception occurred",
            path=request.url.path,
            method=request.method,
            status_code=exc.status_code,
            detail=exc.detail,
        )
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "message": exc.detail,
                "status_code": exc.status_code,
                "path": request.url.path,
            },
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle request validation errors."""
        logger.error(
            "Validation error occurred",
            path=request.url.path,
            method=request.method,
            errors=exc.errors(),
        )
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": True,
                "message": "Validation error",
                "details": exc.errors(),
                "path": request.url.path,
            },
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Handle general exceptions."""
        logger.error(
            "Unexpected error occurred",
            path=request.url.path,
            method=request.method,
            error=str(exc),
            exc_info=True,
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": True,
                "message": "Internal server error" if not settings.debug else str(exc),
                "status_code": 500,
                "path": request.url.path,
            },
        )


# Create application instance
app = create_application()


@app.get("/", tags=["Health"])
async def root() -> dict:
    """Root endpoint with basic API information."""
    return {
        "message": "PORTMAN Backend API",
        "version": settings.version,
        "status": "online",
        "docs": f"{settings.docs_url}" if settings.debug else "Contact administrator for API documentation",
    }


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.version,
        "environment": settings.environment,
    }
