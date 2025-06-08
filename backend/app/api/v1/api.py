"""
API v1 router configuration.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, cv_analysis, portfolios

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(cv_analysis.router, prefix="/cv", tags=["CV Analysis"])
api_router.include_router(portfolios.router, prefix="/portfolios", tags=["Portfolios"])
