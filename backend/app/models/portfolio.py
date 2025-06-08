"""
Portfolio model for generated portfolios.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Portfolio(Base):
    """Portfolio model for generated professional portfolios."""
    
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cv_analysis_id = Column(Integer, ForeignKey("cv_analyses.id"), nullable=True)
    
    # Portfolio metadata
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Portfolio configuration
    template_id = Column(String(100), nullable=False)  # modern, classic, creative, etc.
    theme = Column(String(50), default="default")
    color_scheme = Column(JSON, nullable=True)
    
    # Content sections (JSON for flexibility)
    header_section = Column(JSON, nullable=True)  # name, title, contact info
    about_section = Column(JSON, nullable=True)  # professional summary
    skills_section = Column(JSON, nullable=True)  # technical and soft skills
    experience_section = Column(JSON, nullable=True)  # work experience
    education_section = Column(JSON, nullable=True)  # education details
    projects_section = Column(JSON, nullable=True)  # portfolio projects
    certifications_section = Column(JSON, nullable=True)  # certifications
    testimonials_section = Column(JSON, nullable=True)  # client testimonials
    contact_section = Column(JSON, nullable=True)  # contact form and info
    
    # SEO and metadata
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(JSON, nullable=True)
    
    # Publication settings
    is_public = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    custom_domain = Column(String(255), nullable=True)
    
    # Analytics and performance
    view_count = Column(Integer, default=0)
    last_viewed_at = Column(DateTime, nullable=True)
    
    # Generation info
    generation_model = Column(String(100), nullable=True)  # AI model used
    generation_prompt = Column(Text, nullable=True)
    generation_parameters = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="portfolios")
    cv_analysis = relationship("CVAnalysis", back_populates="portfolios")
    
    def __repr__(self) -> str:
        return f"<Portfolio(id={self.id}, user_id={self.user_id}, title='{self.title}')>"


class ATSResume(Base):
    """ATS-optimized resume model."""
    
    __tablename__ = "ats_resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cv_analysis_id = Column(Integer, ForeignKey("cv_analyses.id"), nullable=True)
    
    # Resume metadata
    title = Column(String(255), nullable=False)
    target_job_title = Column(String(255), nullable=True)
    target_industry = Column(String(100), nullable=True)
    target_company = Column(String(255), nullable=True)
    
    # Resume content (structured JSON)
    content = Column(JSON, nullable=False)
    
    # ATS optimization data
    ats_score = Column(Integer, nullable=True)  # 0-100 ATS compatibility score
    keyword_optimization = Column(JSON, nullable=True)  # keyword analysis
    formatting_score = Column(Integer, nullable=True)  # formatting compatibility
    
    # File information
    file_path = Column(String(500), nullable=True)
    file_format = Column(String(20), default="docx")  # docx, pdf
    file_size = Column(Integer, nullable=True)
    
    # Generation settings
    template_style = Column(String(50), default="professional")
    optimization_level = Column(String(20), default="standard")  # basic, standard, aggressive
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="ats_resumes")
    cv_analysis = relationship("CVAnalysis", back_populates="ats_resumes")
    
    def __repr__(self) -> str:
        return f"<ATSResume(id={self.id}, user_id={self.user_id}, title='{self.title}')>"
