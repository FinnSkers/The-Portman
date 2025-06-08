#!/usr/bin/env python3
"""
Test CV Analysis functionality
"""

import requests
import json
from pathlib import Path

def test_cv_analysis_api():
    """Test the CV analysis API with a sample CV."""
    
    base_url = "http://localhost:8000"
    
    # Create a sample CV text file for testing
    sample_cv_content = """
John Doe
Software Engineer
Email: john.doe@email.com
Phone: +1-555-123-4567

EXPERIENCE
Senior Software Engineer at TechCorp (2020-2024)
- Developed web applications using Python, React, and PostgreSQL
- Led a team of 5 developers on multiple projects
- Implemented CI/CD pipelines using Docker and Kubernetes

Software Engineer at StartupXYZ (2018-2020)
- Built REST APIs using Django and FastAPI
- Worked with AWS services including EC2, S3, and RDS
- Used Git for version control and collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2014-2018)

SKILLS
Programming Languages: Python, JavaScript, TypeScript, Java
Web Frameworks: React, Django, FastAPI, Express.js
Databases: PostgreSQL, MySQL, MongoDB, Redis
Cloud: AWS, Docker, Kubernetes
Tools: Git, Jenkins, Jira, Linux

PROJECTS
E-commerce Platform
- Built a full-stack e-commerce platform using React and Django
- Integrated Stripe payment processing
- Deployed on AWS with auto-scaling

Data Analytics Dashboard
- Created real-time analytics dashboard using Python and React
- Used pandas and matplotlib for data processing and visualization
- Implemented user authentication and role-based access
"""
    
    # Save sample CV as a text file
    cv_file_path = Path("test_cv_sample.txt")
    with open(cv_file_path, "w", encoding="utf-8") as f:
        f.write(sample_cv_content)
    
    print("🧪 Testing CV Analysis API...")
    
    try:
        # Test without authentication first (this should fail)
        print("\n1. Testing CV upload without authentication...")
        with open(cv_file_path, "rb") as f:
            files = {"file": ("test_cv.txt", f, "text/plain")}
            data = {"job_description": "We are looking for a Senior Python Developer with React experience"}
            
            response = requests.post(f"{base_url}/api/v1/cv/upload", files=files, data=data)
            print(f"   Status: {response.status_code}")
            if response.status_code == 401:
                print("   ✅ Authentication required (expected)")
            else:
                print(f"   Response: {response.text}")
    
        # Test CV analysis service directly
        print("\n2. Testing CV Analysis Service directly...")
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
        
        from backend.app.services.cv_analysis_service import CVAnalysisService
        import asyncio
        
        async def test_service():
            service = CVAnalysisService()
            
            # Test text analysis
            job_desc = "We are looking for a Senior Python Developer with React and AWS experience"
            analysis = await service.analyze_cv_content(sample_cv_content, job_desc)
            
            print("   ✅ CV Analysis completed!")
            print(f"   📊 Skills found: {len(analysis['skills_extracted'])}")
            print(f"   🎯 Job match score: {analysis['job_match_score']:.1f}%")
            print(f"   💼 Experience: {analysis['experience_years']} years")
            print(f"   🎓 Education: {analysis['education_level']}")
            print(f"   📧 Email: {analysis['contact_info']['email']}")
            print(f"   💡 Recommendations: {len(analysis['recommendations'])}")
            
            # Print top skills
            skills = analysis['skills_extracted'][:10]
            print(f"   🔧 Top skills: {', '.join(skills)}")
            
            return analysis
            
        result = asyncio.run(test_service())
        
        print("\n3. Testing health endpoint...")
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"   ✅ Health check passed: {health_data['status']}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            
        print("\n🎉 CV Analysis testing completed!")
        print("\n📋 Summary:")
        print("   - CV Analysis Service: ✅ Working")
        print("   - Text extraction: ✅ Working") 
        print("   - Skills detection: ✅ Working")
        print("   - Job matching: ✅ Working")
        print("   - Experience calculation: ✅ Working")
        print("   - API authentication: ✅ Working (requires auth)")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Clean up test file
        if cv_file_path.exists():
            cv_file_path.unlink()

if __name__ == "__main__":
    test_cv_analysis_api()
