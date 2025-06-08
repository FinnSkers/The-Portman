"""
CV Analysis Service - Core functionality for parsing and analyzing CVs
"""

import asyncio
import json
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import PyPDF2
import docx
from io import BytesIO

class CVAnalysisService:
    """Service for analyzing CV content and extracting key information."""

    def __init__(self):
        self.skills_database = self._load_skills_database()
        self.education_keywords = {
            "phd": 4, "doctorate": 4, "doctoral": 4,
            "masters": 3, "master": 3, "msc": 3, "mba": 3,
            "bachelor": 2, "degree": 2, "bsc": 2, "ba": 2,
            "diploma": 1, "certificate": 1, "certification": 1
        }

    def _load_skills_database(self) -> Dict[str, List[str]]:
        """Load skills database for matching."""
        return {
            "programming": [
                "python", "javascript", "java", "c++", "c#", "go", "rust", "php",
                "typescript", "kotlin", "swift", "ruby", "scala", "dart", "r"
            ],
            "web_development": [
                "react", "angular", "vue", "node.js", "express", "django", "flask",
                "fastapi", "spring", "laravel", "rails", "next.js", "nuxt.js"
            ],
            "databases": [
                "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
                "sqlite", "oracle", "sql server", "dynamodb", "cassandra"
            ],
            "cloud": [
                "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
                "jenkins", "github actions", "gitlab ci", "circleci"
            ],
            "data_science": [
                "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
                "keras", "matplotlib", "seaborn", "jupyter", "spark"
            ],
            "tools": [
                "git", "jira", "confluence", "slack", "figma", "postman",
                "vscode", "intellij", "eclipse", "linux", "bash"
            ]
        }

    async def extract_text_from_file(self, file_content: bytes, filename: str) -> str:
        """Extract text from uploaded file."""
        filename_lower = filename.lower()
        
        try:
            if filename_lower.endswith('.pdf'):
                return await self._extract_from_pdf(file_content)
            elif filename_lower.endswith(('.doc', '.docx')):
                return await self._extract_from_docx(file_content)
            else:
                raise ValueError(f"Unsupported file format: {filename}")
        except Exception as e:
            raise ValueError(f"Error extracting text from {filename}: {str(e)}")

    async def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file."""
        try:
            pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")

    async def _extract_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file."""
        try:
            doc = docx.Document(BytesIO(file_content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")

    async def analyze_cv_content(self, text: str, job_description: Optional[str] = None) -> Dict:
        """Perform comprehensive CV analysis."""
        # Clean the text
        cleaned_text = self._clean_text(text)
        
        # Extract key information
        skills = await self._extract_skills(cleaned_text)
        experience = await self._calculate_experience(cleaned_text)
        education = await self._analyze_education(cleaned_text)
        contact_info = await self._extract_contact_info(cleaned_text)
        
        # Calculate job match score if job description provided
        job_match_score = 0.0
        recommendations = []
        
        if job_description:
            job_match_score = await self._calculate_job_match(cleaned_text, job_description, skills)
            recommendations = await self._generate_recommendations(skills, job_description)
        
        return {
            "extracted_text": text[:2000] + "..." if len(text) > 2000 else text,
            "skills_extracted": skills,
            "experience_years": experience,
            "education_level": education,
            "contact_info": contact_info,
            "job_match_score": job_match_score,
            "recommendations": recommendations,
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "word_count": len(text.split()),
            "sections_detected": await self._detect_sections(cleaned_text)
        }

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text for analysis."""
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text)
        text = text.lower().strip()
        return text

    async def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from CV text."""
        found_skills = []
        
        for category, skills_list in self.skills_database.items():
            for skill in skills_list:
                if skill.lower() in text:
                    found_skills.append(skill)
        
        # Remove duplicates and sort
        return sorted(list(set(found_skills)))

    async def _calculate_experience(self, text: str) -> int:
        """Calculate years of experience from CV text."""
        # Look for experience patterns
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'experience.*?(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s*in\s*\w+',
        ]
        
        years = []
        for pattern in experience_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            years.extend([int(match) for match in matches])
        
        # Also look for date ranges in employment
        date_pattern = r'(19|20)\d{2}'
        dates = re.findall(date_pattern, text)
        
        if dates:
            years_list = [int(date) for date in dates]
            if len(years_list) >= 2:
                experience_from_dates = max(years_list) - min(years_list)
                years.append(experience_from_dates)
        
        return max(years) if years else 0

    async def _analyze_education(self, text: str) -> str:
        """Analyze education level from CV text."""
        education_score = 0
        found_education = "unknown"
        
        for keyword, score in self.education_keywords.items():
            if keyword in text:
                if score > education_score:
                    education_score = score
                    found_education = keyword
        
        # Map to standard levels
        education_mapping = {
            "unknown": "Unknown",
            "certificate": "Certificate",
            "diploma": "Diploma", 
            "bachelor": "Bachelor's Degree",
            "master": "Master's Degree",
            "phd": "PhD/Doctorate"
        }
        
        return education_mapping.get(found_education, "Unknown")

    async def _extract_contact_info(self, text: str) -> Dict[str, Optional[str]]:
        """Extract contact information from CV."""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'[\+]?[1-9]?[0-9]{7,15}'
        
        emails = re.findall(email_pattern, text)
        phones = re.findall(phone_pattern, text)
        
        return {
            "email": emails[0] if emails else None,
            "phone": phones[0] if phones else None,
        }

    async def _calculate_job_match(self, cv_text: str, job_description: str, cv_skills: List[str]) -> float:
        """Calculate how well the CV matches the job description."""
        if not job_description:
            return 0.0
        
        job_desc_lower = job_description.lower()
        
        # Extract skills from job description
        job_skills = []
        for category, skills_list in self.skills_database.items():
            for skill in skills_list:
                if skill.lower() in job_desc_lower:
                    job_skills.append(skill)
        
        if not job_skills:
            return 0.0
        
        # Calculate match percentage
        matching_skills = set(cv_skills) & set(job_skills)
        match_percentage = len(matching_skills) / len(job_skills) * 100
        
        return min(match_percentage, 100.0)

    async def _generate_recommendations(self, cv_skills: List[str], job_description: str) -> List[str]:
        """Generate recommendations for improving CV."""
        recommendations = []
        job_desc_lower = job_description.lower()
        
        # Check for missing popular skills
        popular_skills = ["python", "javascript", "react", "aws", "docker", "git"]
        missing_popular = [skill for skill in popular_skills if skill not in cv_skills and skill in job_desc_lower]
        
        if missing_popular:
            recommendations.append(f"Consider adding these in-demand skills: {', '.join(missing_popular)}")
        
        # Skills category recommendations
        skill_categories = list(self.skills_database.keys())
        cv_skill_categories = []
        
        for category, skills_list in self.skills_database.items():
            if any(skill in cv_skills for skill in skills_list):
                cv_skill_categories.append(category)
        
        if len(cv_skill_categories) < 3:
            recommendations.append("Consider expanding your skill set across more technology areas")
        
        # Generic recommendations
        if len(cv_skills) < 10:
            recommendations.append("Add more technical skills to strengthen your profile")
        
        return recommendations[:5]  # Limit to 5 recommendations

    async def _detect_sections(self, text: str) -> List[str]:
        """Detect common CV sections."""
        sections = []
        section_keywords = {
            "experience": ["experience", "work history", "employment", "career"],
            "education": ["education", "academic", "qualification", "degree"],
            "skills": ["skills", "technical skills", "competencies"],
            "projects": ["projects", "portfolio", "work samples"],
            "certifications": ["certifications", "certificates", "training"],
        }
        
        for section, keywords in section_keywords.items():
            if any(keyword in text for keyword in keywords):
                sections.append(section)
        
        return sections
