"""
CV Analysis model for storing parsed CV data and analysis results.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class CVAnalysis(Base):
    """CV Analysis model with comprehensive analysis data."""
    
    __tablename__ = "cv_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # File information
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_type = Column(String(50), nullable=False)
    
    # Extracted content
    raw_text = Column(Text, nullable=True)
    
    # Parsed data (JSON fields)
    personal_info = Column(JSON, nullable=True)  # name, email, phone, address, etc.
    skills = Column(JSON, nullable=True)  # technical and soft skills
    experience = Column(JSON, nullable=True)  # work experience
    education = Column(JSON, nullable=True)  # educational background
    certifications = Column(JSON, nullable=True)  # certifications and licenses
    languages = Column(JSON, nullable=True)  # language proficiencies
    projects = Column(JSON, nullable=True)  # personal/professional projects
    
    # AI Analysis results
    professional_summary = Column(Text, nullable=True)
    strengths = Column(JSON, nullable=True)
    areas_for_improvement = Column(JSON, nullable=True)
    career_recommendations = Column(JSON, nullable=True)
    industry_fit = Column(JSON, nullable=True)
    
    # Scoring and metrics
    overall_score = Column(Float, nullable=True)  # 0-100 scale
    ats_compatibility_score = Column(Float, nullable=True)
    skill_match_scores = Column(JSON, nullable=True)  # skills vs industry standards
    
    # Processing status
    processing_status = Column(String(50), default="pending")  # pending, processing, completed, failed
    processing_error = Column(Text, nullable=True)
    
    # Vector embeddings info
    embedding_model = Column(String(100), nullable=True)
    vector_collection_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    processed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="cv_analyses")
    portfolios = relationship("Portfolio", back_populates="cv_analysis")
    ats_resumes = relationship("ATSResume", back_populates="cv_analysis")
    
    def __repr__(self) -> str:
        return f"<CVAnalysis(id={self.id}, user_id={self.user_id}, filename='{self.original_filename}')>"
