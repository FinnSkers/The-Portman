# Advanced RAG endpoints for comprehensive CV analysis
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import logging
from backend.rag_utils_fixed import (
    upsert_cv_embedding,
    query_similar_professionals,
    get_professional_benchmark
)
from backend.rag_utils import (
    compare_with_professionals,
    get_industry_insights,
    calculate_match_score,
    store_cv_embedding
)

router = APIRouter()
logger = logging.getLogger(__name__)

class CVAnalysisRequest(BaseModel):
    cv_data: Dict[str, Any]
    analysis_type: str = "comprehensive"  # "quick", "comprehensive", "industry_focused"

class CVAnalysisResponse(BaseModel):
    status: str
    user_profile: Dict[str, Any]
    benchmark: Dict[str, Any]
    improvement_suggestions: List[str]
    similar_professionals: List[Dict[str, Any]]
    industry_insights: Dict[str, Any]
    match_score: float
    recommendations: Dict[str, Any]

@router.post("/cv/rag/analyze/", response_model=CVAnalysisResponse)
async def comprehensive_cv_analysis(request: CVAnalysisRequest):
    """
    Comprehensive CV analysis using RAG system.
    Provides detailed professional benchmarking, suggestions, and industry insights.
    """
    try:
        cv_data = request.cv_data
        
        # Store CV embedding for future comparisons
        storage_result = store_cv_embedding(cv_data)
        logger.info(f"CV storage result: {storage_result}")
        
        # Get professional comparison
        comparison_result = compare_with_professionals(cv_data)
        
        if comparison_result['status'] != 'success':
            raise HTTPException(status_code=500, detail="Professional comparison failed")
        
        # Get industry insights
        industry = comparison_result['user_profile']['industry']
        industry_insights = get_industry_insights(industry)
        
        # Generate personalized recommendations
        recommendations = generate_personalized_recommendations(
            cv_data, 
            comparison_result, 
            industry_insights
        )
        
        return CVAnalysisResponse(
            status="success",
            user_profile=comparison_result['user_profile'],
            benchmark=comparison_result['benchmark'],
            improvement_suggestions=comparison_result['improvement_suggestions'],
            similar_professionals=comparison_result['similar_professionals'],
            industry_insights=industry_insights,
            match_score=comparison_result['match_score'],
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Comprehensive CV analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def generate_personalized_recommendations(
    cv_data: Dict[str, Any], 
    comparison_result: Dict[str, Any], 
    industry_insights: Dict[str, Any]
) -> Dict[str, Any]:
    """Generate personalized career recommendations."""
    
    match_score = comparison_result['match_score']
    user_profile = comparison_result['user_profile']
    
    recommendations = {
        'priority_level': 'high' if match_score < 60 else 'medium' if match_score < 80 else 'low',
        'career_stage_advice': {},
        'skill_development': {},
        'networking': {},
        'career_advancement': {}
    }
    
    # Career stage advice
    experience_level = user_profile['experience_level']
    if experience_level == 'entry_level':
        recommendations['career_stage_advice'] = {
            'focus': 'Building foundational skills and gaining experience',
            'timeline': '6-12 months',
            'key_actions': [
                'Complete relevant projects',
                'Seek internships or entry-level positions',
                'Build professional network',
                'Obtain industry certifications'
            ]
        }
    elif experience_level == 'junior':
        recommendations['career_stage_advice'] = {
            'focus': 'Specialization and skill advancement',
            'timeline': '1-2 years',
            'key_actions': [
                'Develop specialized expertise',
                'Take on leadership roles in projects',
                'Mentor junior colleagues',
                'Pursue advanced certifications'
            ]
        }
    
    # Skill development recommendations
    trending_skills = industry_insights.get('trending_skills', [])
    recommendations['skill_development'] = {
        'trending_skills': trending_skills,
        'learning_resources': [
            'Online courses (Coursera, Udemy)',
            'Professional workshops',
            'Industry conferences',
            'Peer learning groups'
        ],
        'practice_opportunities': [
            'Personal projects',
            'Open source contributions',
            'Hackathons',
            'Professional competitions'
        ]
    }
    
    # Networking recommendations
    recommendations['networking'] = {
        'platforms': ['LinkedIn', 'Industry forums', 'Professional associations'],
        'events': ['Industry conferences', 'Local meetups', 'Webinars'],
        'strategies': [
            'Join professional associations',
            'Attend industry events',
            'Engage on professional social media',
            'Seek mentorship opportunities'
        ]
    }
    
    # Career advancement
    salary_range = industry_insights.get('average_salary', 'Not available')
    recommendations['career_advancement'] = {
        'expected_salary_range': salary_range,
        'growth_rate': industry_insights.get('growth_rate', 'Not available'),
        'advancement_paths': [
            'Technical specialist',
            'Team lead',
            'Project manager',
            'Department head'
        ],
        'timeline_to_next_level': '1-2 years with focused development'
    }
    
    return recommendations

@router.get("/cv/rag/industry-insights/{industry}")
async def get_industry_analysis(industry: str):
    """Get detailed industry analysis and trends."""
    try:
        insights = get_industry_insights(industry)
        return {
            'status': 'success',
            'industry': industry,
            'insights': insights
        }
    except Exception as e:
        logger.error(f"Industry analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/cv/rag/benchmark/{industry}/{experience_level}")
async def get_industry_benchmark(industry: str, experience_level: str):
    """Get industry-specific benchmark data."""
    try:
        # Generate benchmark with empty skills for general reference
        benchmark = get_professional_benchmark({
            'industry': industry,
            'experience_level': experience_level,
            'skills': []
        })
        
        return {
            'status': 'success',
            'industry': industry,
            'experience_level': experience_level,
            'benchmark': benchmark
        }
    except Exception as e:
        logger.error(f"Benchmark retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=f"Benchmark failed: {str(e)}")
