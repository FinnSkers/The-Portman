# Handles user registration, login, and profile endpoints (stubs)
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy import Column, Integer, String, Boolean, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional
import os
from pydantic import BaseModel
from auth_utils import verify_password, get_password_hash, create_access_token, get_current_user

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/users", tags=["users"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    username: Optional[str] = None  # Optional, auto-generate if not provided

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register/", status_code=201)
async def register_user(payload: RegisterRequest, db=Depends(get_db)):
    # Use email as username if username not provided
    username = payload.username or payload.email.split("@")[0]
    user = db.query(User).filter((User.username == username) | (User.email == payload.email)).first()
    if user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = get_password_hash(payload.password)
    new_user = User(username=username, email=payload.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username": new_user.username, "email": new_user.email, "registered": True}

@router.post("/login/")
async def login_user(payload: LoginRequest, db=Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": user.email, "name": user.username}}

@router.get("/me/")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "is_admin": current_user.is_admin,
        "created_at": current_user.created_at
    }
