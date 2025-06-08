"""
CV Analysis API endpoints for PORTMAN backend.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.cv_analysis import CVAnalysisCreate, CVAnalysisResponse
from app.services.cv_analysis_service import CVAnalysisService

router = APIRouter()
cv_service = CVAnalysisService()


@router.post("/upload", response_model=dict)
async def upload_cv(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload and analyze a CV file."""
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, DOC, and DOCX files are supported"
        )
    
    try:
        # Read file content
        content = await file.read()
        
        # Extract text from file
        extracted_text = await cv_service.extract_text_from_file(content, file.filename)
        
        # Analyze CV content
        analysis_result = await cv_service.analyze_cv_content(extracted_text, job_description)
        
        # Prepare response
        response = {
            "id": 1,  # TODO: Save to database and return real ID
            "filename": file.filename,
            "content_type": file.content_type,
            "file_size": len(content),
            "analysis_status": "completed",
            "user_id": current_user.id,
            **analysis_result
        }
        
        return response
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing CV: {str(e)}"
        )


@router.get("/", response_model=List[dict])
async def list_cv_analyses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all CV analyses for the current user."""
    # TODO: Implement database query to get user's CV analyses
    return []


@router.get("/{analysis_id}", response_model=dict)
async def get_cv_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific CV analysis by ID."""
    # TODO: Implement database query to get CV analysis
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="CV analysis not found"
    )


@router.delete("/{analysis_id}")
async def delete_cv_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a CV analysis."""
    # TODO: Implement database deletion
    return {"message": "CV analysis deleted successfully"}
