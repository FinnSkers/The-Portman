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
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from auth_utils import verify_password, get_password_hash, create_access_token, get_current_user, get_current_admin_user
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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
    reset_token = Column(String, nullable=True)
    reset_token_expires_at = Column(DateTime, nullable=True)

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

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

def generate_reset_token():
    """Generate a secure random token for password reset"""
    return secrets.token_urlsafe(32)

def send_reset_email(email: str, reset_token: str):
    """Send password reset email (mock implementation)"""
    # For now, just print the reset token (in production, send actual email)
    print(f"Password reset email for {email}")
    print(f"Reset token: {reset_token}")
    print(f"Reset URL: http://localhost:3000/reset-password?token={reset_token}")
    
    # TODO: Implement actual email sending
    # Example email sending code (uncomment and configure for production):
    # try:
    #     smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    #     smtp_port = int(os.getenv("SMTP_PORT", "587"))
    #     smtp_username = os.getenv("SMTP_USERNAME")
    #     smtp_password = os.getenv("SMTP_PASSWORD")
    #     
    #     msg = MIMEMultipart()
    #     msg['From'] = smtp_username
    #     msg['To'] = email
    #     msg['Subject'] = "Password Reset Request"
    #     
    #     reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    #     body = f"""
    #     Hello,
    #     
    #     You requested a password reset for your account. Click the link below to reset your password:
    #     {reset_url}
    #     
    #     This link will expire in 1 hour.
    #     
    #     If you didn't request this, please ignore this email.
    #     
    #     Best regards,
    #     The PORTMAN Team
    #     """
    #     
    #     msg.attach(MIMEText(body, 'plain'))
    #     
    #     server = smtplib.SMTP(smtp_server, smtp_port)
    #     server.starttls()
    #     server.login(smtp_username, smtp_password)
    #     server.send_message(msg)
    #     server.quit()
    #     
    #     return True
    # except Exception as e:
    #     print(f"Failed to send email: {e}")
    #     return False
    
    return True  # Mock success

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

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    """OAuth2 compatible token endpoint for Swagger UI"""
    # Try to find user by username or email
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me/")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "is_admin": current_user.is_admin,
        "created_at": current_user.created_at
    }

@router.post("/forgot-password/")
async def forgot_password(payload: ForgotPasswordRequest, db=Depends(get_db)):
    """Initiate password reset process"""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Return success even if user doesn't exist (security best practice)
        return {"message": "If an account with that email exists, we've sent a password reset link."}
    
    # Generate reset token
    reset_token = generate_reset_token()
    reset_expires_at = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    
    # Save token to database
    user.reset_token = reset_token
    user.reset_token_expires_at = reset_expires_at
    db.commit()
    
    # Send reset email
    email_sent = send_reset_email(user.email, reset_token)
    
    if not email_sent:
        raise HTTPException(
            status_code=500, 
            detail="Failed to send reset email. Please try again later."
        )
    
    return {"message": "If an account with that email exists, we've sent a password reset link."}

@router.post("/reset-password/")
async def reset_password(payload: ResetPasswordRequest, db=Depends(get_db)):
    """Reset password using the token"""
    user = db.query(User).filter(User.reset_token == payload.token).first()
    
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    # Check if token has expired
    if user.reset_token_expires_at and user.reset_token_expires_at < datetime.utcnow():
        # Clear expired token
        user.reset_token = None
        user.reset_token_expires_at = None
        db.commit()
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired. Please request a new password reset."
        )
    
    # Validate new password
    if len(payload.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long"
        )
    
    # Update password and clear reset token
    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expires_at = None
    db.commit()
    
    return {"message": "Password has been reset successfully. You can now log in with your new password."}

@router.get("/admin/users/")
async def get_all_users(db=Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "created_at": user.created_at
        }
        for user in users
    ]
