"""
Core configuration module for PORTMAN Backend.
Handles environment variables, database settings, and application configuration.
"""

import os
import secrets
from functools import lru_cache
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr, HttpUrl, PostgresDsn, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with validation and type hints."""
    
    # Application
    app_name: str = "PORTMAN Backend"
    version: str = "3.0.0"
    debug: bool = False
    environment: str = "development"
    secret_key: str = secrets.token_urlsafe(32)
    
    # API
    api_v1_prefix: str = "/api/v1"
    docs_url: str = "/docs"
    redoc_url: str = "/redoc"
    openapi_url: str = "/openapi.json"
      # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:5173",
        "https://portman.app"
    ]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]    # Database
    database_url: Optional[str] = None
    postgres_server: str = "localhost"
    postgres_user: str = "portman"
    postgres_password: str = "portman123"
    postgres_db: str = "portman"
    postgres_port: str = "5432"
    
    def get_database_url(self) -> str:
        """Get the database URL."""
        if self.database_url:
            return self.database_url
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_server}:{self.postgres_port}/{self.postgres_db}"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: Optional[str] = None
    
    # Authentication
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    password_reset_token_expire_hours: int = 48
    email_verification_token_expire_hours: int = 24
    
    # JWT
    jwt_algorithm: str = "HS256"
    jwt_secret_key: str = secrets.token_urlsafe(32)
    jwt_refresh_secret_key: str = secrets.token_urlsafe(32)
    
    # Email
    smtp_tls: bool = True
    smtp_port: Optional[int] = None
    smtp_host: Optional[str] = None
    smtp_user: Optional[EmailStr] = None
    smtp_password: Optional[str] = None
    emails_from_email: Optional[EmailStr] = None
    emails_from_name: Optional[str] = None
    
    # File Storage
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: List[str] = [".pdf", ".docx", ".doc", ".txt"]
    
    # AI Services
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    google_ai_api_key: Optional[str] = None
    
    # Vector Database
    chroma_host: str = "localhost"
    chroma_port: int = 8000
    chroma_collection_name: str = "portman_documents"
    
    # Monitoring
    sentry_dsn: Optional[HttpUrl] = None
    enable_metrics: bool = True
    log_level: str = "INFO"
    
    # Rate Limiting    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds
    
    # Background Tasks
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        env_prefix = "PORTMAN_"
        extra = "ignore"  # Ignore extra fields from .env


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Application settings instance
settings = get_settings()
