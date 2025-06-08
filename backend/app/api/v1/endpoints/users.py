"""
User management endpoints.
"""

from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import security, verify_token
from app.schemas.user import UserPublic, UserUpdate, UserPasswordUpdate
from app.services.user_service import UserService

router = APIRouter()


async def get_current_user_dependency(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    """Dependency to get current authenticated user."""
    user_id = verify_token(credentials.credentials, token_type="access")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token"
        )
    
    user_service = UserService(db)
    user = await user_service.get(int(user_id))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return user


@router.get("/profile", response_model=UserPublic)
async def get_user_profile(
    current_user = Depends(get_current_user_dependency)
) -> Any:
    """Get current user's profile."""
    return current_user


@router.put("/profile", response_model=UserPublic)
async def update_user_profile(
    user_update: UserUpdate,
    current_user = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update current user's profile."""
    user_service = UserService(db)
    updated_user = await user_service.update(current_user.id, user_update)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return updated_user


@router.put("/password")
async def update_password(
    password_update: UserPasswordUpdate,
    current_user = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update user password."""
    from app.core.security import verify_password
    
    # Verify current password
    if not verify_password(password_update.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    user_service = UserService(db)
    updated_user = await user_service.update_password(
        current_user.id, 
        password_update.new_password
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Password updated successfully"}


@router.delete("/account")
async def delete_account(
    current_user = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Delete user account."""
    user_service = UserService(db)
    deleted = await user_service.delete(current_user.id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Account deleted successfully"}
