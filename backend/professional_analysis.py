# Professional analysis and business logic for PORTMAN
from typing import Dict, Any

def cv_to_text(cv_data: dict) -> str:
    text_parts = []
    if cv_data.get('name'):
        text_parts.append(f"Name: {cv_data['name']}")
    if cv_data.get('email'):
        text_parts.append(f"Email: {cv_data['email']}")
    if cv_data.get('skills') and isinstance(cv_data['skills'], list):
        text_parts.append(f"Skills: {', '.join(cv_data['skills'])}")
    if cv_data.get('experience'):
        if isinstance(cv_data['experience'], list):
            exp_text = '. '.join([str(exp) for exp in cv_data['experience']])
            text_parts.append(f"Experience: {exp_text}")
        else:
            text_parts.append(f"Experience: {cv_data['experience']}")
    if cv_data.get('education'):
        if isinstance(cv_data['education'], list):
            edu_text = '. '.join([str(edu) for edu in cv_data['education']])
            text_parts.append(f"Education: {edu_text}")
        else:
            text_parts.append(f"Education: {cv_data['education']}")
    if cv_data.get('summary'):
        text_parts.append(f"Summary: {cv_data['summary']}")
    return ' | '.join(text_parts)

def determine_experience_level(cv_data: dict) -> str:
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
    skills = cv_data.get('skills', [])
    education = cv_data.get('education', '')
    all_text = ' '.join([str(skill) for skill in skills] + [str(education)]).lower()
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

def store_cv_embedding(cv_data: dict) -> dict:
    try:
        cv_text = cv_to_text(cv_data)
        embedding = [0.1] * 1536
        metadata = {
            'name': cv_data.get('name', 'Unknown'),
            'skills': cv_data.get('skills', []),
            'experience_level': determine_experience_level(cv_data),
            'industry': determine_industry(cv_data),
            'text': cv_text[:500]
        }
        return {
            'status': 'success',
            'storage_method': 'local_fallback',
            'embedding_dimension': len(embedding),
            'metadata': metadata
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }

def get_industry_insights(industry: str) -> dict:
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
    score = 0
    total_weight = 0
    skills_weight = 0.4
    skill_match = benchmark.get('skill_match_percentage', 0) / 100
    score += skill_match * skills_weight
    total_weight += skills_weight
    count_weight = 0.2
    user_count = benchmark.get('user_skills_count', 0)
    expected_count = benchmark.get('average_skills_count', 8)
    count_match = min(user_count / expected_count, 1.0) if expected_count > 0 else 0
    score += count_match * count_weight
    total_weight += count_weight
    projects_weight = 0.2
    has_projects = 1.0 if cv_data.get('projects') else 0.0
    score += has_projects * projects_weight
    total_weight += projects_weight
    cert_weight = 0.1
    has_certs = 1.0 if cv_data.get('certifications') else 0.0
    score += has_certs * cert_weight
    total_weight += cert_weight
    summary_weight = 0.1
    has_summary = 1.0 if cv_data.get('summary') else 0.0
    score += has_summary * summary_weight
    total_weight += summary_weight
    final_score = (score / total_weight) * 100 if total_weight > 0 else 0
    return round(final_score, 2)

def generate_professional_benchmark(industry: str, experience_level: str, user_skills: list) -> dict:
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
    default_benchmark = {
        'required_skills': ['Communication', 'Problem Solving', 'Teamwork'],
        'average_skills_count': 8,
        'common_certifications': ['Professional Development Certificate'],
        'expected_projects': 2,
        'salary_range': '$30,000 - $50,000'
    }
    benchmark = benchmarks.get(industry, {}).get(experience_level, default_benchmark)
    user_skill_set = set([skill.lower() for skill in user_skills])
    required_skill_set = set([skill.lower() for skill in benchmark['required_skills']])
    skill_match_percentage = len(user_skill_set.intersection(required_skill_set)) / len(required_skill_set) * 100 if required_skill_set else 0
    benchmark['skill_match_percentage'] = round(skill_match_percentage, 2)
    benchmark['user_skills_count'] = len(user_skills)
    return benchmark

def generate_improvement_suggestions(cv_data: dict, benchmark: dict) -> list:
    suggestions = []
    user_skills = set([skill.lower() for skill in cv_data.get('skills', [])])
    required_skills = set([skill.lower() for skill in benchmark.get('required_skills', [])])
    missing_skills = required_skills - user_skills
    if missing_skills:
        suggestions.append(f"Consider adding these industry-relevant skills: {', '.join(missing_skills)}")
    if benchmark['user_skills_count'] < benchmark['average_skills_count']:
        suggestions.append(f"Industry professionals typically have {benchmark['average_skills_count']} skills. Consider expanding your skill set.")
    projects = cv_data.get('projects', [])
    if isinstance(projects, list) and len(projects) < benchmark.get('expected_projects', 2):
        suggestions.append(f"Add more projects to your portfolio. Industry professionals typically showcase {benchmark['expected_projects']} projects.")
    if not cv_data.get('certifications'):
        suggestions.append(f"Consider obtaining certifications such as: {', '.join(benchmark.get('common_certifications', []))}")
    if not cv_data.get('summary'):
        suggestions.append("Add a professional summary to highlight your key strengths and career objectives.")
    if not cv_data.get('linkedin'):
        suggestions.append("Add your LinkedIn profile to enhance professional networking opportunities.")
    return suggestions[:5]

def find_similar_professionals(cv_data: dict, industry: str, experience_level: str) -> list:
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
    professionals = similar_professionals_db.get(industry, {}).get(experience_level, [])
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

def compare_with_professionals(cv_data: dict) -> dict:
    try:
        experience_level = determine_experience_level(cv_data)
        industry = determine_industry(cv_data)
        skills = cv_data.get('skills', [])
        benchmark = generate_professional_benchmark(industry, experience_level, skills)
        suggestions = generate_improvement_suggestions(cv_data, benchmark)
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
        return {
            'status': 'error',
            'error': str(e)
        }
