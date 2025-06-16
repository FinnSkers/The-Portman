# Handles user registration, login, and profile endpoints (stubs)
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel
from auth_utils import verify_password, get_password_hash, create_access_token, get_current_user, get_current_admin_user
import json

# Import database components directly to avoid circular imports
from models import User
from database import SessionLocal

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

class UpdateProfileWithCVRequest(BaseModel):
    parsed_data: Dict[str, Any]

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

@router.put("/update-profile-from-cv/")
async def update_profile_from_cv(
    payload: UpdateProfileWithCVRequest, 
    current_user: User = Depends(get_current_user),
    db=Depends(get_db)
):
    """Update user profile with parsed CV data"""
    try:
        parsed_data = payload.parsed_data
          # Update user fields with parsed CV data
        if parsed_data.get('name'):
            setattr(current_user, 'full_name', parsed_data['name'])
        if parsed_data.get('phone'):
            setattr(current_user, 'phone', parsed_data['phone'])
        if parsed_data.get('address'):
            setattr(current_user, 'address', parsed_data['address'])
        if parsed_data.get('summary'):
            setattr(current_user, 'summary', parsed_data['summary'])
        
        # Store complex data as JSON strings
        if parsed_data.get('experience'):
            setattr(current_user, 'experience_json', json.dumps(parsed_data['experience']))
        if parsed_data.get('education'):
            setattr(current_user, 'education_json', json.dumps(parsed_data['education']))
        if parsed_data.get('skills'):
            setattr(current_user, 'skills_json', json.dumps(parsed_data['skills']))
        if parsed_data.get('languages'):
            setattr(current_user, 'languages_json', json.dumps(parsed_data['languages']))
        if parsed_data.get('certifications'):
            setattr(current_user, 'certifications_json', json.dumps(parsed_data['certifications']))
        if parsed_data.get('links'):
            setattr(current_user, 'links_json', json.dumps(parsed_data['links']))
        
        # Update timestamp        setattr(current_user, 'cv_updated_at', datetime.utcnow())
        
        # Commit changes
        db.commit()
        db.refresh(current_user)
        
        return {
            "message": "Profile updated successfully with CV data",
            "updated_fields": {
                "name": getattr(current_user, 'full_name', None),
                "phone": getattr(current_user, 'phone', None),
                "address": getattr(current_user, 'address', None),
                "summary": getattr(current_user, 'summary', None),
                "cv_updated_at": getattr(current_user, 'cv_updated_at', None)
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.get("/profile/")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get user profile including CV data"""
    try:
        profile_data = {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "is_admin": current_user.is_admin,
            "created_at": current_user.created_at,            "cv_data": {
                "full_name": getattr(current_user, 'full_name', None),
                "phone": getattr(current_user, 'phone', None),
                "address": getattr(current_user, 'address', None),
                "summary": getattr(current_user, 'summary', None),
                "experience": json.loads(getattr(current_user, 'experience_json', '[]')) if getattr(current_user, 'experience_json', None) else [],
                "education": json.loads(getattr(current_user, 'education_json', '[]')) if getattr(current_user, 'education_json', None) else [],
                "skills": json.loads(getattr(current_user, 'skills_json', '[]')) if getattr(current_user, 'skills_json', None) else [],
                "languages": json.loads(getattr(current_user, 'languages_json', '[]')) if getattr(current_user, 'languages_json', None) else [],
                "certifications": json.loads(getattr(current_user, 'certifications_json', '[]')) if getattr(current_user, 'certifications_json', None) else [],
                "links": json.loads(getattr(current_user, 'links_json', '[]')) if getattr(current_user, 'links_json', None) else [],
                "cv_updated_at": getattr(current_user, 'cv_updated_at', None)
            }
        }
        
        return profile_data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve profile: {str(e)}"
        )

@router.post("/refresh/")
async def refresh_access_token(current_user: User = Depends(get_current_user)):
    """Refresh access token for authenticated user"""
    access_token = create_access_token(data={"sub": current_user.username})
    return {"access_token": access_token, "token_type": "bearer"}
