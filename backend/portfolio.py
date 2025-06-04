# Portfolio generation endpoints
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import logging
import json
import os
from datetime import datetime

router = APIRouter(prefix="/portfolio", tags=["portfolio"])
logger = logging.getLogger(__name__)

# Portfolio templates configuration
PORTFOLIO_TEMPLATES = {
    "modern-tech": {
        "name": "Modern Tech",
        "description": "Perfect for software engineers and tech professionals",
        "style": "modern",
        "features": ["3D animations", "Dark theme", "Code highlighting", "Interactive projects"],
        "color_scheme": {
            "primary": "#8b5cf6",
            "secondary": "#3b82f6",
            "accent": "#10b981",
            "background": "#0f172a",
            "text": "#ffffff"
        },
        "layout": {
            "header_style": "modern",
            "navigation": "sidebar",
            "sections": ["hero", "about", "skills", "projects", "experience", "contact"]
        }
    },
    "creative-designer": {
        "name": "Creative Designer",
        "description": "Showcase your design portfolio with style",
        "style": "creative",
        "features": ["Image galleries", "Color schemes", "Typography focus", "Animation effects"],
        "color_scheme": {
            "primary": "#f59e0b",
            "secondary": "#ef4444",
            "accent": "#8b5cf6",
            "background": "#fefefe",
            "text": "#1f2937"
        },
        "layout": {
            "header_style": "creative",
            "navigation": "horizontal",
            "sections": ["hero", "portfolio", "about", "services", "testimonials", "contact"]
        }
    },
    "business-professional": {
        "name": "Business Professional",
        "description": "Clean and corporate design for business roles",
        "style": "classic",
        "features": ["Clean layout", "Professional colors", "Charts & graphs", "Achievement showcase"],
        "color_scheme": {
            "primary": "#1e40af",
            "secondary": "#059669",
            "accent": "#dc2626",
            "background": "#ffffff",
            "text": "#374151"
        },
        "layout": {
            "header_style": "professional",
            "navigation": "horizontal",
            "sections": ["hero", "about", "experience", "achievements", "skills", "contact"]
        }
    },
    "minimal-portfolio": {
        "name": "Minimal Portfolio",
        "description": "Simple, elegant design that focuses on content",
        "style": "minimal",
        "features": ["Minimal design", "Fast loading", "Typography focus", "Mobile optimized"],
        "color_scheme": {
            "primary": "#6b7280",
            "secondary": "#374151",
            "accent": "#9ca3af",
            "background": "#f9fafb",
            "text": "#111827"
        },
        "layout": {
            "header_style": "minimal",
            "navigation": "top",
            "sections": ["hero", "about", "work", "contact"]
        }
    }
}

class PortfolioGenerationRequest(BaseModel):
    cv_data: Dict[str, Any]
    template_id: str
    customizations: Optional[Dict[str, Any]] = {}
    personal_info: Optional[Dict[str, Any]] = {}

class PortfolioGenerationResponse(BaseModel):
    status: str
    portfolio_id: str
    template_info: Dict[str, Any]
    generated_sections: Dict[str, Any]
    preview_url: str
    download_url: str

class PortfolioCustomizationRequest(BaseModel):
    portfolio_id: str
    customizations: Dict[str, Any]

@router.get("/templates/")
async def get_portfolio_templates():
    """Get all available portfolio templates with their configurations."""
    return {
        "status": "success",
        "templates": PORTFOLIO_TEMPLATES
    }

@router.post("/generate/", response_model=PortfolioGenerationResponse)
async def generate_portfolio(request: PortfolioGenerationRequest):
    """Generate a portfolio based on CV data and selected template."""
    try:
        if request.template_id not in PORTFOLIO_TEMPLATES:
            raise HTTPException(status_code=400, detail="Invalid template ID")
        
        template = PORTFOLIO_TEMPLATES[request.template_id]
        
        # Extract key information from CV data
        cv_data = request.cv_data
        
        # Generate unique portfolio ID
        portfolio_id = f"portfolio_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Generate portfolio content based on CV data
        generated_sections = generate_portfolio_content(cv_data, template, request.customizations)
        
        # Store portfolio data (in production, this would go to a database)
        portfolio_data = {
            "id": portfolio_id,
            "template_id": request.template_id,
            "template_info": template,
            "cv_data": cv_data,
            "customizations": request.customizations,
            "sections": generated_sections,
            "created_at": datetime.now().isoformat(),
            "status": "generated"
        }
        
        # Save to file (in production, use database)
        portfolio_dir = "generated_portfolios"
        os.makedirs(portfolio_dir, exist_ok=True)
        
        with open(f"{portfolio_dir}/{portfolio_id}.json", "w") as f:
            json.dump(portfolio_data, f, indent=2)
        
        return PortfolioGenerationResponse(
            status="success",
            portfolio_id=portfolio_id,
            template_info=template,
            generated_sections=generated_sections,
            preview_url=f"/portfolio/preview/{portfolio_id}",
            download_url=f"/portfolio/download/{portfolio_id}"
        )
        
    except Exception as e:
        logger.error(f"Portfolio generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Portfolio generation failed: {str(e)}")

@router.get("/preview/{portfolio_id}")
async def get_portfolio_preview(portfolio_id: str):
    """Get portfolio preview data."""
    try:
        portfolio_file = f"generated_portfolios/{portfolio_id}.json"
        
        if not os.path.exists(portfolio_file):
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        with open(portfolio_file, "r") as f:
            portfolio_data = json.load(f)
        
        return {
            "status": "success",
            "portfolio": portfolio_data
        }
        
    except Exception as e:
        logger.error(f"Failed to get portfolio preview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load portfolio preview")

@router.put("/customize/{portfolio_id}")
async def customize_portfolio(portfolio_id: str, request: PortfolioCustomizationRequest):
    """Update portfolio customizations."""
    try:
        portfolio_file = f"generated_portfolios/{portfolio_id}.json"
        
        if not os.path.exists(portfolio_file):
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        with open(portfolio_file, "r") as f:
            portfolio_data = json.load(f)
        
        # Update customizations
        portfolio_data["customizations"].update(request.customizations)
        portfolio_data["updated_at"] = datetime.now().isoformat()
        
        # Regenerate sections with new customizations
        template = PORTFOLIO_TEMPLATES[portfolio_data["template_id"]]
        portfolio_data["sections"] = generate_portfolio_content(
            portfolio_data["cv_data"], 
            template, 
            portfolio_data["customizations"]
        )
        
        # Save updated portfolio
        with open(portfolio_file, "w") as f:
            json.dump(portfolio_data, f, indent=2)
        
        return {
            "status": "success",
            "message": "Portfolio updated successfully",
            "sections": portfolio_data["sections"]
        }
        
    except Exception as e:
        logger.error(f"Portfolio customization failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update portfolio")

def generate_portfolio_content(cv_data: Dict[str, Any], template: Dict[str, Any], customizations: Dict[str, Any]) -> Dict[str, Any]:
    """Generate portfolio content based on CV data and template."""
    
    # Extract personal information
    personal_info = cv_data.get("personal_info", {})
    experience = cv_data.get("experience", [])
    education = cv_data.get("education", [])
    skills = cv_data.get("skills", [])
    projects = cv_data.get("projects", [])
    
    # Generate hero section
    hero_section = {
        "name": personal_info.get("name", "Professional Name"),
        "title": personal_info.get("title", "Professional Title"),
        "summary": personal_info.get("summary", "Professional summary and career objectives."),
        "contact": {
            "email": personal_info.get("email", ""),
            "phone": personal_info.get("phone", ""),
            "location": personal_info.get("location", ""),
            "linkedin": personal_info.get("linkedin", ""),
            "website": personal_info.get("website", "")
        }
    }
    
    # Generate about section
    about_section = {
        "description": personal_info.get("summary", "Passionate professional with extensive experience in the field."),
        "highlights": [
            f"Over {len(experience)} years of professional experience",
            f"Expert in {', '.join(skills[:3]) if skills else 'various technologies'}",
            f"Graduated from {education[0].get('institution', 'Top University') if education else 'Leading Institution'}"
        ]
    }
    
    # Generate skills section
    skills_section = {
        "technical_skills": skills[:8] if skills else ["Technical Skills"],
        "soft_skills": ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
        "certifications": cv_data.get("certifications", [])
    }
    
    # Generate experience section
    experience_section = [
        {
            "company": exp.get("company", "Company Name"),
            "position": exp.get("position", "Position Title"),
            "duration": exp.get("duration", "2020 - Present"),
            "description": exp.get("description", "Key responsibilities and achievements."),
            "achievements": exp.get("achievements", ["Notable achievement 1", "Notable achievement 2"])
        }
        for exp in experience[:4]  # Limit to 4 most recent
    ]
    
    # Generate projects section
    projects_section = [
        {
            "name": proj.get("name", "Project Name"),
            "description": proj.get("description", "Project description and impact."),
            "technologies": proj.get("technologies", ["Technology 1", "Technology 2"]),
            "link": proj.get("link", ""),
            "achievements": proj.get("achievements", ["Key achievement"])
        }
        for proj in projects[:6]  # Limit to 6 projects
    ]
    
    # Generate education section
    education_section = [
        {
            "institution": edu.get("institution", "Institution Name"),
            "degree": edu.get("degree", "Degree"),
            "field": edu.get("field", "Field of Study"),
            "year": edu.get("year", "Year"),
            "gpa": edu.get("gpa", ""),
            "achievements": edu.get("achievements", [])
        }
        for edu in education
    ]
    
    # Apply customizations
    if customizations.get("colors"):
        template["color_scheme"].update(customizations["colors"])
    
    if customizations.get("layout"):
        template["layout"].update(customizations["layout"])
    
    return {
        "hero": hero_section,
        "about": about_section,
        "skills": skills_section,
        "experience": experience_section,
        "projects": projects_section,
        "education": education_section,
        "template_config": template,
        "customizations": customizations
    }
