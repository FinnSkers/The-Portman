"""
User service for business logic and database operations.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """User service for database operations and business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def get_multi(
        self, skip: int = 0, limit: int = 100
    ) -> List[User]:
        """Get multiple users with pagination."""
        result = await self.db.execute(
            select(User).offset(skip).limit(limit)
        )
        return result.scalars().all()
    
    async def create(self, user_create: UserCreate) -> User:
        """Create a new user."""
        hashed_password = get_password_hash(user_create.password)
        
        db_user = User(
            email=user_create.email,
            username=user_create.username,
            hashed_password=hashed_password,
            full_name=user_create.full_name,
            phone=user_create.phone,
            bio=user_create.bio,
            avatar_url=user_create.avatar_url,
        )
        
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        
        return db_user
    
    async def update(self, user_id: int, user_update: UserUpdate) -> Optional[User]:
        """Update user information."""
        # Get current user
        user = await self.get(user_id)
        if not user:
            return None
        
        # Update fields
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def update_password(self, user_id: int, new_password: str) -> Optional[User]:
        """Update user password."""
        user = await self.get(user_id)
        if not user:
            return None
        
        user.hashed_password = get_password_hash(new_password)
        user.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def update_last_login(self, user_id: int) -> None:
        """Update user's last login timestamp."""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login_at=datetime.utcnow())
        )
        await self.db.commit()
    
    async def deactivate(self, user_id: int) -> Optional[User]:
        """Deactivate user account."""
        user = await self.get(user_id)
        if not user:
            return None
        
        user.is_active = False
        user.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def activate(self, user_id: int) -> Optional[User]:
        """Activate user account."""
        user = await self.get(user_id)
        if not user:
            return None
        
        user.is_active = True
        user.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def verify_email(self, user_id: int) -> Optional[User]:
        """Mark user email as verified."""
        user = await self.get(user_id)
        if not user:
            return None
        
        user.is_verified = True
        user.email_verified_at = datetime.utcnow()
        user.verification_token = None
        user.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def delete(self, user_id: int) -> bool:
        """Delete user account."""
        user = await self.get(user_id)
        if not user:
            return False
        
        await self.db.delete(user)
        await self.db.commit()
        
        return True
