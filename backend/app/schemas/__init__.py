"""
Schemas package initialization.
"""

from .user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserPasswordUpdate,
    UserInDB,
    UserPublic,
    UserLogin,
    UserRegister,
    Token,
    TokenData,
    EmailVerification,
    PasswordReset,
    PasswordResetRequest,
)

from .cv_analysis import (
    CVUpload,
    PersonalInfo,
    Skill,
    Experience,
    Education,
    Certification,
    Language,
    Project,
    CVAnalysisCreate,
    CVAnalysisUpdate,
    CVAnalysisResponse,
    CVAnalysisList,
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate", 
    "UserUpdate",
    "UserPasswordUpdate",
    "UserInDB",
    "UserPublic",
    "UserLogin",
    "UserRegister",
    "Token",
    "TokenData",
    "EmailVerification",
    "PasswordReset",
    "PasswordResetRequest",
    
    # CV Analysis schemas
    "CVUpload",
    "PersonalInfo",
    "Skill",
    "Experience",
    "Education", 
    "Certification",
    "Language",
    "Project",
    "CVAnalysisCreate",
    "CVAnalysisUpdate",
    "CVAnalysisResponse",
    "CVAnalysisList",
]
