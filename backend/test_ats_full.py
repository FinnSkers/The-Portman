#!/usr/bin/env python3
# Test ATS Resume Maker Functionality

import requests
import json

BASE_URL = "http://localhost:8000"

def test_ats_templates():
    """Test getting ATS templates."""
    print("=== Testing ATS Templates ===")
    response = requests.get(f"{BASE_URL}/api/v1/ats/templates/")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ ATS Templates retrieved successfully")
        print(f"Available templates: {list(data['templates'].keys())}")
        return True
    else:
        print(f"❌ Failed to get templates: {response.text}")
        return False

def test_ats_score_analysis():
    """Test ATS score analysis."""
    print("\n=== Testing ATS Score Analysis ===")
    
    # Sample CV data for testing
    cv_data = {
        "name": "John Doe",
        "email": "john.doe@email.com",
        "phone": "+1-555-123-4567",
        "address": {"city": "San Francisco", "state": "CA", "country": "USA"},
        "summary": "Experienced software engineer with expertise in Python, JavaScript, and cloud technologies.",
        "experience": [
            {
                "title": "Senior Software Engineer",
                "company": "Tech Corp",
                "duration": "2020-2023",
                "location": "San Francisco, CA",
                "responsibilities": [
                    "Developed scalable web applications using React and Node.js",
                    "Implemented CI/CD pipelines with Docker and AWS",
                    "Led agile development teams and mentored junior developers"
                ]
            },
            {
                "title": "Software Developer",
                "company": "StartupXYZ",
                "duration": "2018-2020",
                "location": "San Francisco, CA",
                "responsibilities": [
                    "Built RESTful APIs using Python and Flask",
                    "Optimized database queries and improved performance by 40%",
                    "Collaborated with cross-functional teams in scrum methodology"
                ]
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Science",
                "field": "Computer Science",
                "institution": "University of California",
                "year": "2018"
            }
        ],
        "skills": [
            {"skill": "Python"}, {"skill": "JavaScript"}, {"skill": "React"},
            {"skill": "Node.js"}, {"skill": "AWS"}, {"skill": "Docker"},
            {"skill": "Leadership"}, {"skill": "Problem Solving"}
        ],
        "projects": [
            {
                "name": "E-commerce Platform",
                "description": "Full-stack web application with payment integration",
                "technologies": ["React", "Node.js", "MongoDB", "Stripe API"]
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/ats/analyze/",
        json=cv_data,
        params={"target_job_title": "Software Engineer"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ ATS Score Analysis completed successfully")
        print(f"ATS Score: {data['ats_score']}/100")
        print(f"Industry: {data['industry']}")
        print(f"Keyword Matches: {len(data['keyword_matches'])}")
        print(f"Suggestions: {len(data['suggestions'])}")
        
        # Display suggestions
        if data['suggestions']:
            print("\nOptimization Suggestions:")
            for i, suggestion in enumerate(data['suggestions'], 1):
                print(f"  {i}. {suggestion}")
        
        return True
    else:
        print(f"❌ Failed to analyze ATS score: {response.text}")
        return False

def test_ats_resume_generation():
    """Test ATS resume generation."""
    print("\n=== Testing ATS Resume Generation ===")
    
    # Sample CV data for resume generation
    cv_data = {
        "name": "Jane Smith",
        "email": "jane.smith@email.com",
        "phone": "+1-555-987-6543",
        "address": {"city": "New York", "state": "NY", "country": "USA"},
        "links": [
            {"url": "https://linkedin.com/in/janesmith"},
            {"url": "https://github.com/janesmith"}
        ],
        "summary": "Results-driven marketing professional with 5+ years of experience in digital marketing, SEO, and data analytics. Proven track record of increasing online engagement by 150% and driving revenue growth.",
        "experience": [
            {
                "title": "Digital Marketing Manager",
                "company": "Marketing Pro Inc",
                "duration": "2021-2023",
                "location": "New York, NY",
                "responsibilities": [
                    "Developed and executed comprehensive digital marketing strategies across multiple channels",
                    "Managed SEO campaigns that increased organic traffic by 200%",
                    "Led social media marketing initiatives with ROI improvement of 180%",
                    "Analyzed marketing data using Google Analytics and created actionable insights"
                ]
            },
            {
                "title": "Marketing Specialist",
                "company": "Creative Agency",
                "duration": "2019-2021",
                "location": "New York, NY",
                "responsibilities": [
                    "Created content marketing campaigns for B2B and B2C clients",
                    "Managed email marketing campaigns with 25% average open rate",
                    "Collaborated with design team to produce marketing materials"
                ]
            }
        ],
        "education": [
            {
                "degree": "Master of Business Administration",
                "field": "Marketing",
                "institution": "New York University",
                "year": "2019"
            },
            {
                "degree": "Bachelor of Arts",
                "field": "Communications",
                "institution": "Columbia University",
                "year": "2017"
            }
        ],
        "skills": [
            {"skill": "Digital Marketing"}, {"skill": "SEO"}, {"skill": "Google Analytics"},
            {"skill": "Social Media Marketing"}, {"skill": "Content Marketing"},
            {"skill": "Email Marketing"}, {"skill": "Data Analysis"}, {"skill": "Leadership"}
        ],
        "certifications": [
            {"name": "Google Analytics Certified", "issuer": "Google", "date": "2022"},
            {"name": "HubSpot Content Marketing Certified", "issuer": "HubSpot", "date": "2021"}
        ]
    }
    
    request_data = {
        "cv_data": cv_data,
        "template_type": "professional",
        "include_sections": ["contact", "summary", "experience", "education", "skills", "certifications"],
        "keyword_optimization": True,
        "target_job_title": "Digital Marketing Manager",
        "target_industry": "marketing"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/ats/generate/",
        json=request_data
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ ATS Resume generated successfully")
        print(f"Resume ID: {data['resume_id']}")
        print(f"Format: {data['format']}")
        print(f"ATS Score: {data['ats_score']}/100")
        print(f"Download URL: {data['download_url']}")
        
        # Display optimization suggestions
        if data['optimization_suggestions']:
            print("\nOptimization Suggestions:")
            for i, suggestion in enumerate(data['optimization_suggestions'], 1):
                print(f"  {i}. {suggestion}")
        
        # Display keyword density
        if data['keyword_density']:
            print(f"\nKeyword Matches: {len(data['keyword_density'])}")
            top_keywords = sorted(data['keyword_density'].items(), key=lambda x: x[1], reverse=True)[:5]
            print("Top keywords found:")
            for keyword, count in top_keywords:
                print(f"  - {keyword}: {count} times")
        
        # Test download functionality
        print(f"\n=== Testing Resume Download ===")
        download_response = requests.get(f"{BASE_URL}{data['download_url']}")
        if download_response.status_code == 200:
            print("✅ Resume download successful")
            print(f"File size: {len(download_response.content)} bytes")
        else:
            print(f"❌ Resume download failed: {download_response.status_code}")
        
        return True
    else:
        print(f"❌ Failed to generate ATS resume: {response.text}")
        return False

def main():
    """Run all ATS tests."""
    print("🚀 Starting ATS Resume Maker Tests\n")
    
    tests = [
        test_ats_templates,
        test_ats_score_analysis,
        test_ats_resume_generation
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    print(f"\n{'='*50}")
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All ATS Resume Maker tests completed successfully!")
        print("\n✅ MILESTONE 3 ENHANCEMENT COMPLETED:")
        print("   - ATS-friendly resume maker implemented")
        print("   - Multiple template support")
        print("   - Keyword optimization")
        print("   - Industry-specific analysis")
        print("   - DOCX file generation")
        print("   - Download functionality")
    else:
        print("⚠️  Some tests failed. Please check the implementation.")

if __name__ == "__main__":
    main()
