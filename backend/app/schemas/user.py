"""
User schemas for API request/response validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user creation."""
    password: str


class UserUpdate(BaseModel):
    """Schema for user updates."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


class UserPasswordUpdate(BaseModel):
    """Schema for password updates."""
    current_password: str
    new_password: str


class UserInDB(UserBase):
    """Schema for user data from database."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_active: bool
    is_verified: bool
    is_superuser: bool
    subscription_type: str
    subscription_expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    email_verified_at: Optional[datetime] = None


class UserPublic(BaseModel):
    """Public user schema (for responses)."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    subscription_type: str
    created_at: datetime


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserRegister(UserCreate):
    """Schema for user registration."""
    confirm_password: str


class Token(BaseModel):
    """Schema for authentication tokens."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Schema for token data."""
    user_id: Optional[int] = None
    email: Optional[str] = None


class EmailVerification(BaseModel):
    """Schema for email verification."""
    token: str


class PasswordReset(BaseModel):
    """Schema for password reset."""
    token: str
    new_password: str


class PasswordResetRequest(BaseModel):
    """Schema for password reset request."""
    email: EmailStr
