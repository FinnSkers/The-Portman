"""
Portfolio endpoints (placeholder).
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_portfolios():
    """Get user's portfolios."""
    return {"message": "Portfolio endpoints - Coming soon!"}


@router.post("/")
async def create_portfolio():
    """Create new portfolio."""
    return {"message": "Portfolio creation endpoint - Coming soon!"}
