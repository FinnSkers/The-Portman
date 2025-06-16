from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    # Basic user info
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expires_at = Column(DateTime, nullable=True)
    
    # Profile info
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    
    # CV Data fields
    summary = Column(Text, nullable=True)
    experience_json = Column(JSON, nullable=True)
    education_json = Column(JSON, nullable=True)
    skills_json = Column(JSON, nullable=True)
    languages_json = Column(JSON, nullable=True)
    certifications_json = Column(JSON, nullable=True)
    links_json = Column(JSON, nullable=True)
    cv_updated_at = Column(DateTime, nullable=True)
    
    # Relationships
    portfolios = relationship("Portfolio", back_populates="owner")
    uploaded_files = relationship("UploadedFile", back_populates="user")
    analytics = relationship("UserAnalytics", back_populates="user")

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    template_name = Column(String, default="modern")
    is_public = Column(Boolean, default=False)
    custom_domain = Column(String, nullable=True)
    theme_config = Column(JSON, nullable=True)
    seo_config = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    views_count = Column(Integer, default=0)
    
    # Relationships
    owner = relationship("User", back_populates="portfolios")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx, txt
    file_size = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime, nullable=True)
    extracted_text = Column(Text, nullable=True)
    ai_analysis = Column(JSON, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="uploaded_files")

class UserAnalytics(Base):
    __tablename__ = "user_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False)  # cv_upload, portfolio_view, etc.
    event_data = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="analytics")

class SystemLog(Base):
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, nullable=False)  # INFO, WARNING, ERROR
    message = Column(Text, nullable=False)
    module = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    extra_data = Column(JSON, nullable=True)

class AIJob(Base):
    __tablename__ = "ai_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_type = Column(String, nullable=False)  # cv_analysis, portfolio_generation, etc.
    status = Column(String, default="pending")  # pending, processing, completed, failed
    input_data = Column(JSON, nullable=True)
    result_data = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    processing_time = Column(Float, nullable=True)  # seconds

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(String, nullable=False)  # free, premium, enterprise
    status = Column(String, default="active")  # active, cancelled, expired
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    auto_renew = Column(Boolean, default=True)
    payment_data = Column(JSON, nullable=True)
