# Comprehensive test for the enhanced RAG system
import pytest
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_comprehensive_rag_analysis():
    """Test the complete RAG analysis workflow"""
    cv_data = {
        "name": "SHEIKH SHAJIDUL ISLAM",
        "skills": ["Yarn Engineering", "Textile Technology", "Quality Control", "Fiber Technology"],
        "experience": "Fresh Graduate from BUTEX",
        "education": "B.Sc in Yarn Engineering, BUTEX",
        "projects": ["Final Year Project on Yarn Quality Analysis"],
        "certifications": [],
        "summary": "Dedicated textile engineering graduate"
    }
    
    response = requests.post(
        f"{BASE_URL}/cv/rag/analyze/",
        json={"cv_data": cv_data, "analysis_type": "comprehensive"}
    )
    
    assert response.status_code == 200
    result = response.json()
    
    # Validate response structure
    assert result["status"] == "success"
    assert "user_profile" in result
    assert "benchmark" in result
    assert "improvement_suggestions" in result
    assert "similar_professionals" in result
    assert "industry_insights" in result
    assert "match_score" in result
    assert "recommendations" in result
    
    # Validate user profile
    profile = result["user_profile"]
    assert profile["name"] == "SHEIKH SHAJIDUL ISLAM"
    assert profile["industry"] == "textile_engineering"
    assert profile["experience_level"] == "entry_level"
    assert profile["skills_count"] == 4
    
    # Validate benchmark
    benchmark = result["benchmark"]
    assert "skill_match_percentage" in benchmark
    assert "required_skills" in benchmark
    assert "average_skills_count" in benchmark
    
    # Validate match score
    assert isinstance(result["match_score"], (int, float))
    assert 0 <= result["match_score"] <= 100
    
    print("✅ Comprehensive RAG Analysis Test PASSED")

def test_industry_insights():
    """Test industry insights endpoint"""
    response = requests.get(f"{BASE_URL}/cv/rag/industry-insights/textile_engineering")
    
    assert response.status_code == 200
    result = response.json()
    
    assert result["status"] == "success"
    assert result["industry"] == "textile_engineering"
    assert "insights" in result
    
    insights = result["insights"]
    assert "growth_rate" in insights
    assert "trending_skills" in insights
    assert "job_outlook" in insights
    assert "average_salary" in insights
    assert "top_companies" in insights
    
    print("✅ Industry Insights Test PASSED")

def test_benchmark_endpoint():
    """Test benchmark retrieval endpoint"""
    response = requests.get(f"{BASE_URL}/cv/rag/benchmark/textile_engineering/entry_level")
    
    assert response.status_code == 200
    result = response.json()
    
    assert result["status"] == "success"
    assert result["industry"] == "textile_engineering"
    assert result["experience_level"] == "entry_level"
    assert "benchmark" in result
    
    benchmark = result["benchmark"]
    assert "required_skills" in benchmark
    assert "average_skills_count" in benchmark
    assert "common_certifications" in benchmark
    
    print("✅ Benchmark Endpoint Test PASSED")

if __name__ == "__main__":
    try:
        test_comprehensive_rag_analysis()
        test_industry_insights()
        test_benchmark_endpoint()
        print("\n🎉 ALL RAG SYSTEM TESTS PASSED! Milestone 2 is 100% COMPLETE!")
    except Exception as e:
        print(f"❌ Test failed: {e}")
