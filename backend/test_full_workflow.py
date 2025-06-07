#!/usr/bin/env python3
# Full ATS Resume Maker Integration Test

import requests
import json

BASE_URL = "http://localhost:8000"

def test_full_cv_to_ats_workflow():
    """Test the complete workflow from CV parsing to ATS resume generation."""
    print("=== FULL CV-TO-ATS WORKFLOW TEST ===\n")
    
    # Step 1: Parse CV (using our existing parsed data structure)
    print("Step 1: Using parsed CV data...")
    
    # Sample parsed CV data (similar to what we get from CV parsing)
    parsed_cv_data = {
        "name": "Sheikh Shajidul Islam",
        "email": "sheikh.islam@email.com",
        "phone": "+880-1234-567890",
        "address": {
            "city": "Dhaka",
            "country": "Bangladesh"
        },
        "links": [
            {"url": "https://linkedin.com/in/sheikhshajidul"},
            {"url": "https://github.com/sheikhshajidul"}
        ],
        "summary": "Experienced Yarn Engineer with expertise in textile manufacturing, quality control, and production optimization. Strong background in yarn engineering from BUTEX with hands-on experience in modern textile technologies.",
        "experience": [
            {
                "title": "Senior Yarn Engineer",
                "company": "Textile Manufacturing Corp",
                "duration": "2020-2024",
                "location": "Dhaka, Bangladesh",
                "responsibilities": [
                    "Led yarn quality control processes ensuring 99% product quality standards",
                    "Optimized production efficiency by implementing modern yarn manufacturing techniques",
                    "Managed cross-functional teams for product development and process improvement",
                    "Conducted technical analysis and troubleshooting for yarn production issues",
                    "Collaborated with international clients for custom yarn specifications"
                ]
            },
            {
                "title": "Yarn Engineer",
                "company": "Bangladesh Textile Mills",
                "duration": "2018-2020",
                "location": "Dhaka, Bangladesh",
                "responsibilities": [
                    "Monitored yarn production processes and maintained quality standards",
                    "Performed testing and analysis of yarn samples for strength and consistency",
                    "Assisted in equipment maintenance and calibration",
                    "Documented production data and generated quality reports"
                ]
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Science",
                "field": "Yarn Engineering",
                "institution": "Bangladesh University of Textiles (BUTEX)",
                "year": "2018",
                "achievements": ["Dean's List", "Textile Excellence Award"]
            }
        ],
        "skills": [
            {"skill": "Yarn Manufacturing"},
            {"skill": "Quality Control"},
            {"skill": "Textile Technology"},
            {"skill": "Production Management"},
            {"skill": "Technical Analysis"},
            {"skill": "Process Optimization"},
            {"skill": "Team Leadership"},
            {"skill": "Project Management"},
            {"skill": "Problem Solving"},
            {"skill": "Data Analysis"}
        ],
        "certifications": [
            {"name": "Certified Textile Professional", "issuer": "Textile Institute", "date": "2021"},
            {"name": "ISO 9001 Quality Management", "issuer": "ISO Certification Body", "date": "2020"}
        ],
        "projects": [
            {
                "name": "Automated Yarn Quality Control System",
                "description": "Developed and implemented automated quality control system reducing defects by 40%",
                "technologies": ["Quality Control Systems", "Data Analysis", "Process Automation"]
            },
            {
                "name": "Sustainable Yarn Production Initiative",
                "description": "Led eco-friendly yarn production project reducing waste by 30%",
                "technologies": ["Sustainable Manufacturing", "Environmental Analysis", "Process Innovation"]
            }
        ]
    }
    
    print("✅ CV data prepared for ATS conversion")
    
    # Step 2: Analyze ATS Score
    print("\nStep 2: Analyzing ATS compatibility...")
    
    analysis_response = requests.post(
        f"{BASE_URL}/api/v1/ats/analyze/",
        json=parsed_cv_data,
        params={"target_job_title": "Senior Yarn Engineer"}
    )
    
    if analysis_response.status_code == 200:
        analysis_data = analysis_response.json()
        print("✅ ATS Analysis completed")
        print(f"   - ATS Score: {analysis_data['ats_score']}/100")
        print(f"   - Industry: {analysis_data['industry']}")
        print(f"   - Keyword Matches: {len(analysis_data['keyword_matches'])}")
        print(f"   - Suggestions: {len(analysis_data['suggestions'])}")
    else:
        print(f"❌ ATS Analysis failed: {analysis_response.text}")
        return False
    
    # Step 3: Generate multiple ATS resume templates
    print("\nStep 3: Generating ATS resumes with different templates...")
    
    templates_to_test = ["clean", "professional", "modern", "minimal"]
    generated_resumes = []
    
    for template in templates_to_test:
        print(f"\n   Testing {template} template...")
        
        request_data = {
            "cv_data": parsed_cv_data,
            "template_type": template,
            "include_sections": ["contact", "summary", "experience", "education", "skills", "certifications", "projects"],
            "keyword_optimization": True,
            "target_job_title": "Senior Yarn Engineer",
            "target_industry": "engineering"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/ats/generate/",
            json=request_data
        )
        
        if response.status_code == 200:
            data = response.json()
            generated_resumes.append(data)
            print(f"   ✅ {template.capitalize()} resume generated")
            print(f"      - Resume ID: {data['resume_id']}")
            print(f"      - ATS Score: {data['ats_score']}/100")
            print(f"      - Keywords found: {len(data['keyword_density'])}")
            
            # Test download
            download_response = requests.get(f"{BASE_URL}{data['download_url']}")
            if download_response.status_code == 200:
                filename = f"sheikh_resume_{template}.docx"
                with open(filename, 'wb') as f:
                    f.write(download_response.content)
                print(f"      - Downloaded: {filename} ({len(download_response.content)} bytes)")
            else:
                print(f"      ❌ Download failed")
        else:
            print(f"   ❌ {template} template failed: {response.text}")
    
    # Step 4: Compare template results
    print(f"\nStep 4: Template Comparison Summary")
    print("=" * 60)
    
    best_score = 0
    best_template = ""
    
    for resume in generated_resumes:
        template = resume['resume_id'].split('_')[-1] if '_' in resume['resume_id'] else "unknown"
        score = resume['ats_score']
        keyword_count = len(resume['keyword_density'])
        suggestion_count = len(resume['optimization_suggestions'])
        
        print(f"{template:12} | Score: {score:5.1f} | Keywords: {keyword_count:2d} | Suggestions: {suggestion_count}")
        
        if score > best_score:
            best_score = score
            best_template = template
    
    print("=" * 60)
    print(f"🏆 Best performing template: {best_template} (Score: {best_score})")
    
    # Step 5: Integration with RAG system
    print(f"\nStep 5: Testing integration with RAG analysis...")
    
    rag_response = requests.post(
        f"{BASE_URL}/api/v1/cv/rag/analyze/",
        json={"cv_data": parsed_cv_data}
    )
    
    if rag_response.status_code == 200:
        rag_data = rag_response.json()
        print("✅ RAG analysis completed")
        print(f"   - Match Score: {rag_data.get('match_score', 'N/A')}")
        print(f"   - Similar Professionals: {len(rag_data.get('similar_professionals', []))}")
        print(f"   - Career Recommendations: {len(rag_data.get('career_recommendations', []))}")
        
        # Show how RAG insights can improve ATS optimization
        if rag_data.get('industry_insights'):
            trending_skills = rag_data['industry_insights'].get('trending_skills', [])
            print(f"\n   💡 RAG-suggested trending skills for ATS optimization:")
            for skill in trending_skills[:5]:
                print(f"      - {skill}")
    else:
        print(f"❌ RAG analysis failed: {rag_response.text}")
    
    print(f"\n🎉 COMPLETE WORKFLOW TEST FINISHED!")
    print(f"✅ Successfully generated {len(generated_resumes)} ATS-optimized resumes")
    print(f"✅ Demonstrated full integration: CV Parsing → RAG Analysis → ATS Generation")
    
    return True

if __name__ == "__main__":
    test_full_cv_to_ats_workflow()
