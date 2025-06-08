"""
CV Analysis schemas for API request/response validation.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class CVUpload(BaseModel):
    """Schema for CV upload metadata."""
    filename: str
    file_size: int
    file_type: str


class PersonalInfo(BaseModel):
    """Schema for personal information."""
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None


class Skill(BaseModel):
    """Schema for individual skill."""
    name: str
    category: str  # technical, soft, language, etc.
    level: Optional[str] = None  # beginner, intermediate, advanced, expert
    years_experience: Optional[int] = None


class Experience(BaseModel):
    """Schema for work experience."""
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    achievements: List[str] = []
    technologies: List[str] = []


class Education(BaseModel):
    """Schema for education."""
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    relevant_coursework: List[str] = []


class Certification(BaseModel):
    """Schema for certifications."""
    name: str
    issuer: str
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None


class Language(BaseModel):
    """Schema for language proficiency."""
    language: str
    proficiency: str  # native, fluent, professional, conversational, basic


class Project(BaseModel):
    """Schema for projects."""
    name: str
    description: Optional[str] = None
    technologies: List[str] = []
    url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class CVAnalysisCreate(BaseModel):
    """Schema for creating CV analysis."""
    personal_info: Optional[PersonalInfo] = None
    skills: List[Skill] = []
    experience: List[Experience] = []
    education: List[Education] = []
    certifications: List[Certification] = []
    languages: List[Language] = []
    projects: List[Project] = []


class CVAnalysisUpdate(BaseModel):
    """Schema for updating CV analysis."""
    personal_info: Optional[PersonalInfo] = None
    skills: Optional[List[Skill]] = None
    experience: Optional[List[Experience]] = None
    education: Optional[List[Education]] = None
    certifications: Optional[List[Certification]] = None
    languages: Optional[List[Language]] = None
    projects: Optional[List[Project]] = None


class CVAnalysisResponse(BaseModel):
    """Schema for CV analysis response."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    original_filename: str
    file_type: str
    file_size: int
    
    # Parsed data
    personal_info: Optional[Dict[str, Any]] = None
    skills: Optional[Dict[str, Any]] = None
    experience: Optional[Dict[str, Any]] = None
    education: Optional[Dict[str, Any]] = None
    certifications: Optional[Dict[str, Any]] = None
    languages: Optional[Dict[str, Any]] = None
    projects: Optional[Dict[str, Any]] = None
    
    # Analysis results
    professional_summary: Optional[str] = None
    strengths: Optional[Dict[str, Any]] = None
    areas_for_improvement: Optional[Dict[str, Any]] = None
    career_recommendations: Optional[Dict[str, Any]] = None
    industry_fit: Optional[Dict[str, Any]] = None
    
    # Scores
    overall_score: Optional[float] = None
    ats_compatibility_score: Optional[float] = None
    skill_match_scores: Optional[Dict[str, Any]] = None
    
    # Status
    processing_status: str
    processing_error: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None


class CVAnalysisList(BaseModel):
    """Schema for paginated CV analysis list."""
    items: List[CVAnalysisResponse]
    total: int
    page: int
    size: int
    pages: int
