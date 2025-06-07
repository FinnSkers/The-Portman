#!/usr/bin/env python3
"""
ATS Resume Maker Test Script
Tests the ATS-friendly resume generation functionality
"""

import requests
import json
from datetime import datetime

# API Configuration
BASE_URL = "http://localhost:8000/api/v1"
ATS_URL = f"{BASE_URL}/ats"

def test_ats_templates():
    """Test getting ATS templates."""
    print("🔍 Testing ATS Templates Endpoint...")
    
    response = requests.get(f"{ATS_URL}/templates/")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ ATS Templates retrieved successfully!")
        print(f"📋 Available templates: {list(data['templates'].keys())}")
        
        for template_id, template in data['templates'].items():
            print(f"  - {template_id}: {template['name']} - {template['description']}")
        
        return data['templates']
    else:
        print(f"❌ Failed to get templates: {response.status_code}")
        print(f"   Error: {response.text}")
        return None

def test_ats_generation():
    """Test ATS resume generation."""
    print("\n🔍 Testing ATS Resume Generation...")
    
    # Sample CV data (you can use real parsed CV data)
    sample_cv_data = {
        "name": "John Smith",
        "email": "john.smith@email.com",
        "phone": "+1-555-0123",
        "address": {
            "city": "San Francisco",
            "state": "CA",
            "country": "USA"
        },
        "summary": "Experienced software engineer with 5+ years in full-stack development and cloud technologies.",
        "experience": [
            {
                "title": "Senior Software Engineer",
                "company": "TechCorp Inc.",
                "duration": "2022 - Present",
                "location": "San Francisco, CA",
                "responsibilities": [
                    {"task": "Lead development", "description": "Led a team of 5 developers in building scalable web applications"},
                    {"task": "Microservices architecture", "description": "Designed and implemented microservices using Python and Docker"},
                    {"task": "Cloud deployment", "description": "Deployed applications on AWS with CI/CD pipelines"}
                ]
            },
            {
                "title": "Software Developer",
                "company": "StartupXYZ",
                "duration": "2020 - 2022",
                "location": "Remote",
                "responsibilities": [
                    {"task": "Frontend development", "description": "Built responsive web applications using React and TypeScript"},
                    {"task": "API development", "description": "Created RESTful APIs using FastAPI and PostgreSQL"}
                ]
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Science",
                "field": "Computer Science",
                "institution": "University of California, Berkeley",
                "year": "2020",
                "gpa": "3.8"
            }
        ],
        "skills": [
            {"skill": "Python"},
            {"skill": "JavaScript"},
            {"skill": "React"},
            {"skill": "AWS"},
            {"skill": "Docker"},
            {"skill": "PostgreSQL"},
            {"skill": "Git"},
            {"skill": "Agile"},
            {"skill": "Leadership"},
            {"skill": "Problem Solving"}
        ],
        "projects": [
            {
                "name": "E-commerce Platform",
                "description": "Full-stack e-commerce platform with payment integration",
                "technologies": ["React", "Node.js", "PostgreSQL", "Stripe"],
                "achievements": ["Increased sales by 40%", "Reduced load time by 60%"]
            }
        ],
        "certifications": [
            {"name": "AWS Certified Solutions Architect", "issuer": "Amazon Web Services", "date": "2023"}
        ],
        "links": [
            {"url": "https://linkedin.com/in/johnsmith", "type": "linkedin"},
            {"url": "https://github.com/johnsmith", "type": "github"}
        ]
    }
    
    # Test different templates
    templates_to_test = ["clean", "minimal", "professional", "modern"]
    
    for template_type in templates_to_test:
        print(f"\n📄 Testing {template_type} template...")
        
        request_data = {
            "cv_data": sample_cv_data,
            "template_type": template_type,
            "include_sections": ["contact", "summary", "experience", "education", "skills", "certifications"],
            "keyword_optimization": True,
            "target_job_title": "Senior Software Engineer",
            "target_industry": "software"
        }
        
        response = requests.post(f"{ATS_URL}/generate/", json=request_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {template_type.title()} resume generated successfully!")
            print(f"   📊 ATS Score: {data['ats_score']}/100")
            print(f"   📝 Resume ID: {data['resume_id']}")
            print(f"   📋 Preview: {data['preview_text'][:100]}...")
            print(f"   🔍 Keywords found: {len(data['keyword_density'])}")
            print(f"   💡 Suggestions: {len(data['optimization_suggestions'])}")
            
            if data['optimization_suggestions']:
                print("   📌 Top suggestions:")
                for i, suggestion in enumerate(data['optimization_suggestions'][:3], 1):
                    print(f"      {i}. {suggestion}")
            
            # Test download
            download_url = data['download_url'].replace('/api/v1', BASE_URL)
            download_response = requests.get(download_url)
            if download_response.status_code == 200:
                print(f"   ✅ Download successful ({len(download_response.content)} bytes)")
                
                # Save file for manual inspection
                filename = f"test_resume_{template_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
                with open(filename, 'wb') as f:
                    f.write(download_response.content)
                print(f"   💾 Saved as: {filename}")
            else:
                print(f"   ❌ Download failed: {download_response.status_code}")
        
        else:
            print(f"❌ Failed to generate {template_type} resume: {response.status_code}")
            print(f"   Error: {response.text}")

def test_ats_analysis():
    """Test ATS score analysis."""
    print("\n🔍 Testing ATS Score Analysis...")
    
    sample_cv_data = {
        "name": "Jane Developer",
        "email": "jane@example.com",
        "skills": ["Python", "React", "AWS", "Docker"],
        "experience": [
            {
                "title": "Software Engineer",
                "company": "Tech Company",
                "responsibilities": ["Developed web applications", "Worked with APIs"]
            }
        ],
        "education": [
            {"degree": "BS Computer Science", "institution": "Tech University"}
        ]
    }
    
    # Test analysis without target job
    response = requests.post(f"{ATS_URL}/analyze/", json=sample_cv_data)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ ATS Analysis completed successfully!")
        print(f"   📊 ATS Score: {data['ats_score']}/100")
        print(f"   🏭 Detected Industry: {data['industry']}")
        print(f"   🔑 Keyword Matches: {len(data['keyword_matches'])}")
        print(f"   💡 Suggestions: {len(data['suggestions'])}")
        
        if data['keyword_matches']:
            print("   🎯 Matched Keywords:")
            for keyword, count in list(data['keyword_matches'].items())[:5]:
                print(f"      - {keyword}: {count} mentions")
        
        if data['missing_keywords']:
            print("   ❌ Missing Keywords:")
            for keyword in data['missing_keywords'][:5]:
                print(f"      - {keyword}")
        
    else:
        print(f"❌ ATS Analysis failed: {response.status_code}")
        print(f"   Error: {response.text}")
    
    # Test analysis with target job
    print("\n🎯 Testing with target job title...")
    params = {"target_job_title": "Senior Python Developer"}
    response = requests.post(f"{ATS_URL}/analyze/", json=sample_cv_data, params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Targeted analysis completed! Score: {data['ats_score']}/100")
        print(f"   🏭 Industry: {data['industry']}")
    else:
        print(f"❌ Targeted analysis failed: {response.status_code}")

def main():
    """Run all ATS resume maker tests."""
    print("🚀 PORTMAN ATS Resume Maker Test Suite")
    print("=" * 50)
    
    try:
        # Test templates
        templates = test_ats_templates()
        
        if templates:
            # Test generation
            test_ats_generation()
            
            # Test analysis
            test_ats_analysis()
            
            print("\n" + "=" * 50)
            print("✅ All ATS Resume Maker tests completed!")
            print("📄 Check generated .docx files for manual review")
        else:
            print("❌ Cannot proceed without templates")
    
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server!")
        print("   Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    main()
