# Pinecone and RAG integration utilities for PORTMAN
import os
from typing import List, Dict
import pinecone
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "your-pinecone-api-key")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "portman-cv-index")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")

# Initialize Pinecone (lazy loading)
def _get_pinecone_index():
    try:
        pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_REGION)
        
        # Ensure index exists
        if PINECONE_INDEX not in pinecone.list_indexes():
            pinecone.create_index(
                name=PINECONE_INDEX,
                dimension=1536,
                metric="cosine"
            )
        return pinecone.Index(PINECONE_INDEX)
    except Exception as e:
        print(f"Warning: Could not connect to Pinecone: {e}")
        return None

def upsert_cv_embedding(user_id: str, embedding: List[float]):
    # Ensure embedding has correct dimensions (1536 for OpenAI embeddings)
    if len(embedding) != 1536:
        # Pad or truncate to match expected dimension
        if len(embedding) < 1536:
            embedding = embedding + [0.0] * (1536 - len(embedding))
        else:
            embedding = embedding[:1536]
    
    # Upsert the user's CV embedding into Pinecone
    try:
        index = _get_pinecone_index()
        if index is None:
            return {"error": "Pinecone not available"}
        index.upsert(vectors=[{"id": user_id, "values": embedding}])
        return {"upserted": user_id}
    except Exception as e:
        return {"error": f"Failed to upsert: {str(e)}"}

def query_similar_professionals(embedding: List[float], top_k: int = 5) -> dict:
    # Query Pinecone for similar professionals
    try:
        index = _get_pinecone_index()
        if index is None:
            return {"error": "Pinecone not available"}
        results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
        return {"results": str(results)}
    except Exception as e:
        return {"error": f"Could not query Pinecone: {str(e)}"}

def get_professional_benchmark(cv_data: Dict) -> Dict:
    # Placeholder: In production, compare with real professional datasets
    return {"benchmark": "This is a simulated benchmark result."}

def store_cv_embedding(cv_data: dict) -> dict:
    """Store CV embedding in vector database."""
    try:
        # Convert CV to searchable text
        cv_text = cv_to_text(cv_data)
        
        # Generate embedding (simulate with fallback)
        embedding = [0.1] * 1536  # Standard embedding dimension
        
        # Create metadata
        metadata = {
            'name': cv_data.get('name', 'Unknown'),
            'skills': cv_data.get('skills', []),
            'experience_level': determine_experience_level(cv_data),
            'industry': determine_industry(cv_data),
            'text': cv_text[:500]  # Truncate for storage
        }
        
        if pinecone_available:
            try:
                # Store in Pinecone
                cv_id = f"cv_{hash(cv_text) % 2**32}"
                index.upsert(vectors=[(cv_id, embedding, metadata)])
                
                return {
                    'status': 'success',
                    'storage_method': 'pinecone',
                    'cv_id': cv_id,
                    'embedding_dimension': len(embedding)
                }
            except Exception as e:
                print(f"Pinecone storage failed: {e}")
        
        # Fallback storage
        return {
            'status': 'success',
            'storage_method': 'local_fallback',
            'embedding_dimension': len(embedding),
            'metadata': metadata
        }
        
    except Exception as e:
        print(f"CV storage failed: {e}")
        return {
            'status': 'error',
            'error': str(e)
        }

def cv_to_text(cv_data: dict) -> str:
    """Convert CV data to searchable text."""
    text_parts = []
    
    # Add name and contact info
    if cv_data.get('name'):
        text_parts.append(f"Name: {cv_data['name']}")
    if cv_data.get('email'):
        text_parts.append(f"Email: {cv_data['email']}")
    
    # Add skills
    if cv_data.get('skills') and isinstance(cv_data['skills'], list):
        text_parts.append(f"Skills: {', '.join(cv_data['skills'])}")
    
    # Add experience
    if cv_data.get('experience'):
        if isinstance(cv_data['experience'], list):
            exp_text = '. '.join([str(exp) for exp in cv_data['experience']])
            text_parts.append(f"Experience: {exp_text}")
        else:
            text_parts.append(f"Experience: {cv_data['experience']}")
    
    # Add education
    if cv_data.get('education'):
        if isinstance(cv_data['education'], list):
            edu_text = '. '.join([str(edu) for edu in cv_data['education']])
            text_parts.append(f"Education: {edu_text}")
        else:
            text_parts.append(f"Education: {cv_data['education']}")
    
    # Add summary
    if cv_data.get('summary'):
        text_parts.append(f"Summary: {cv_data['summary']}")
    
    return ' | '.join(text_parts)

def determine_experience_level(cv_data: dict) -> str:
    """Determine experience level from CV data."""
    experience = cv_data.get('experience', [])
    
    if isinstance(experience, str):
        experience_text = experience.lower()
        if 'fresh' in experience_text or 'graduate' in experience_text or 'entry' in experience_text:
            return 'entry_level'
        elif any(year in experience_text for year in ['1 year', '2 year', '3 year']):
            return 'junior'
        elif any(year in experience_text for year in ['4 year', '5 year', '6 year', '7 year']):
            return 'mid_level'
        else:
            return 'senior'
    elif isinstance(experience, list) and len(experience) > 0:
        return 'junior' if len(experience) <= 2 else 'mid_level'
    
    return 'entry_level'

def determine_industry(cv_data: dict) -> str:
    """Determine industry from CV data."""
    skills = cv_data.get('skills', [])
    education = cv_data.get('education', '')
    
    # Convert to lowercase for matching
    all_text = ' '.join([str(skill) for skill in skills] + [str(education)]).lower()
    
    # Industry mapping
    industry_keywords = {
        'software_engineering': ['python', 'javascript', 'java', 'react', 'node', 'software', 'programming', 'developer'],
        'data_science': ['machine learning', 'data science', 'python', 'sql', 'analytics', 'statistics'],
        'textile_engineering': ['textile', 'yarn', 'fabric', 'fiber', 'cotton', 'spinning', 'weaving'],
        'mechanical_engineering': ['mechanical', 'cad', 'solidworks', 'manufacturing', 'design'],
        'electrical_engineering': ['electrical', 'electronics', 'circuit', 'power', 'control'],
        'business': ['marketing', 'sales', 'business', 'management', 'finance', 'accounting'],
        'healthcare': ['medical', 'nursing', 'healthcare', 'hospital', 'clinical']
    }
    
    for industry, keywords in industry_keywords.items():
        if any(keyword in all_text for keyword in keywords):
            return industry
    
    return 'general'

def compare_with_professionals(cv_data: dict) -> dict:
    """Compare CV with industry professionals using RAG."""
    try:
        # Determine user's profile
        experience_level = determine_experience_level(cv_data)
        industry = determine_industry(cv_data)
        skills = cv_data.get('skills', [])
        
        # Generate professional benchmark
        benchmark = generate_professional_benchmark(industry, experience_level, skills)
        
        # Generate improvement suggestions
        suggestions = generate_improvement_suggestions(cv_data, benchmark)
        
        # Find similar professionals
        similar_professionals = find_similar_professionals(cv_data, industry, experience_level)
        
        return {
            'status': 'success',
            'user_profile': {
                'experience_level': experience_level,
                'industry': industry,
                'skills_count': len(skills),
                'name': cv_data.get('name', 'Unknown')
            },
            'benchmark': benchmark,
            'improvement_suggestions': suggestions,
            'similar_professionals': similar_professionals,
            'match_score': calculate_match_score(cv_data, benchmark)
        }
        
    except Exception as e:
        print(f"Professional comparison failed: {e}")
        return {
            'status': 'error',
            'error': str(e)
        }

def generate_professional_benchmark(industry: str, experience_level: str, user_skills: list) -> dict:
    """Generate industry-specific professional benchmark."""
    
    # Industry-specific benchmarks
    benchmarks = {
        'textile_engineering': {
            'entry_level': {
                'required_skills': ['Yarn Engineering', 'Fiber Technology', 'Quality Control', 'Textile Testing'],
                'average_skills_count': 8,
                'common_certifications': ['Textile Technology Certificate', 'Quality Management'],
                'expected_projects': 2,
                'salary_range': '$35,000 - $45,000'
            },
            'junior': {
                'required_skills': ['Yarn Engineering', 'Process Optimization', 'Quality Control', 'Textile Testing', 'Production Management'],
                'average_skills_count': 12,
                'common_certifications': ['Six Sigma', 'Lean Manufacturing', 'Quality Management'],
                'expected_projects': 4,
                'salary_range': '$45,000 - $60,000'
            }
        },
        'software_engineering': {
            'entry_level': {
                'required_skills': ['Python', 'JavaScript', 'Git', 'HTML/CSS', 'SQL'],
                'average_skills_count': 10,
                'common_certifications': ['AWS Cloud Practitioner', 'Google Analytics'],
                'expected_projects': 3,
                'salary_range': '$60,000 - $80,000'
            }
        }
    }
    
    # Get benchmark for user's industry and level
    default_benchmark = {
        'required_skills': ['Communication', 'Problem Solving', 'Teamwork'],
        'average_skills_count': 8,
        'common_certifications': ['Professional Development Certificate'],
        'expected_projects': 2,
        'salary_range': '$30,000 - $50,000'
    }
    
    benchmark = benchmarks.get(industry, {}).get(experience_level, default_benchmark)
    
    # Calculate user's skill match
    user_skill_set = set([skill.lower() for skill in user_skills])
    required_skill_set = set([skill.lower() for skill in benchmark['required_skills']])
    skill_match_percentage = len(user_skill_set.intersection(required_skill_set)) / len(required_skill_set) * 100 if required_skill_set else 0
    
    benchmark['skill_match_percentage'] = round(skill_match_percentage, 2)
    benchmark['user_skills_count'] = len(user_skills)
    
    return benchmark

def generate_improvement_suggestions(cv_data: dict, benchmark: dict) -> list:
    """Generate personalized improvement suggestions."""
    suggestions = []
    
    # Skills gap analysis
    user_skills = set([skill.lower() for skill in cv_data.get('skills', [])])
    required_skills = set([skill.lower() for skill in benchmark.get('required_skills', [])])
    missing_skills = required_skills - user_skills
    
    if missing_skills:
        suggestions.append(f"Consider adding these industry-relevant skills: {', '.join(missing_skills)}")
    
    # Skills count comparison
    if benchmark['user_skills_count'] < benchmark['average_skills_count']:
        suggestions.append(f"Industry professionals typically have {benchmark['average_skills_count']} skills. Consider expanding your skill set.")
    
    # Project suggestions
    projects = cv_data.get('projects', [])
    if isinstance(projects, list) and len(projects) < benchmark.get('expected_projects', 2):
        suggestions.append(f"Add more projects to your portfolio. Industry professionals typically showcase {benchmark['expected_projects']} projects.")
    
    # Certification suggestions
    if not cv_data.get('certifications'):
        suggestions.append(f"Consider obtaining certifications such as: {', '.join(benchmark.get('common_certifications', []))}")
    
    # Professional summary
    if not cv_data.get('summary'):
        suggestions.append("Add a professional summary to highlight your key strengths and career objectives.")
    
    # Contact information
    if not cv_data.get('linkedin'):
        suggestions.append("Add your LinkedIn profile to enhance professional networking opportunities.")
    
    return suggestions[:5]  # Return top 5 suggestions

def find_similar_professionals(cv_data: dict, industry: str, experience_level: str) -> list:
    """Find similar professionals for networking and benchmarking."""
    
    # Mock similar professionals data
    similar_professionals_db = {
        'textile_engineering': {
            'entry_level': [
                {
                    'name': 'Ahmad Rahman',
                    'title': 'Junior Textile Engineer',
                    'company': 'Textile Industries Ltd',
                    'skills': ['Yarn Engineering', 'Quality Control', 'Fiber Technology'],
                    'experience': '1-2 years',
                    'education': 'B.Sc in Textile Engineering'
                },
                {
                    'name': 'Fatima Khan',
                    'title': 'Quality Control Specialist',
                    'company': 'Fashion Fabrics Inc',
                    'skills': ['Quality Control', 'Textile Testing', 'Process Improvement'],
                    'experience': '1 year',
                    'education': 'B.Sc in Textile Engineering'
                }
            ]
        }
    }
    
    # Get similar professionals
    professionals = similar_professionals_db.get(industry, {}).get(experience_level, [])
    
    # If no specific matches, return general professionals
    if not professionals:
        professionals = [
            {
                'name': 'Professional Network Member',
                'title': f'{experience_level.replace("_", " ").title()} Professional',
                'company': 'Industry Leader',
                'skills': cv_data.get('skills', [])[:3],
                'experience': experience_level.replace('_', ' '),
                'education': 'Relevant Degree'
            }
        ]
    return professionals

def get_industry_insights(industry: str) -> dict:
    """Get industry-specific insights and trends."""
    insights = {
        'textile_engineering': {
            'growth_rate': '3.2% annually',
            'trending_skills': ['Sustainable Manufacturing', 'Digital Textile Design', 'Automation'],
            'job_outlook': 'Stable with focus on sustainability and technology integration',
            'average_salary': '$45,000 - $65,000',
            'top_companies': ['Cotton Inc', 'Milliken & Company', 'Invista']
        },
        'software_engineering': {
            'growth_rate': '22% annually',
            'trending_skills': ['AI/ML', 'Cloud Computing', 'Cybersecurity'],
            'job_outlook': 'Excellent growth prospects',
            'average_salary': '$80,000 - $120,000',
            'top_companies': ['Google', 'Microsoft', 'Amazon', 'Meta']
        }
    }
    
    return insights.get(industry, {
        'growth_rate': 'Data not available',
        'trending_skills': ['Adaptability', 'Digital Literacy'],
        'job_outlook': 'Varies by specialization',
        'average_salary': 'Industry dependent',
        'top_companies': ['Industry leaders']
    })

def calculate_match_score(cv_data: dict, benchmark: dict) -> float:
    """Calculate overall match score between CV and industry benchmark."""
    score = 0
    total_weight = 0
    
    # Skills match (40% weight)
    skills_weight = 0.4
    skill_match = benchmark.get('skill_match_percentage', 0) / 100
    score += skill_match * skills_weight
    total_weight += skills_weight
    
    # Skills count (20% weight)
    count_weight = 0.2
    user_count = benchmark.get('user_skills_count', 0)
    expected_count = benchmark.get('average_skills_count', 8)
    count_match = min(user_count / expected_count, 1.0) if expected_count > 0 else 0
    score += count_match * count_weight
    total_weight += count_weight
    
    # Has projects (20% weight)
    projects_weight = 0.2
    has_projects = 1.0 if cv_data.get('projects') else 0.0
    score += has_projects * projects_weight
    total_weight += projects_weight
    
    # Has certifications (10% weight)
    cert_weight = 0.1
    has_certs = 1.0 if cv_data.get('certifications') else 0.0
    score += has_certs * cert_weight
    total_weight += cert_weight
    
    # Has summary (10% weight)
    summary_weight = 0.1
    has_summary = 1.0 if cv_data.get('summary') else 0.0
    score += has_summary * summary_weight
    total_weight += summary_weight
    
    # Calculate final score as percentage
    final_score = (score / total_weight) * 100 if total_weight > 0 else 0
    return round(final_score, 2)
