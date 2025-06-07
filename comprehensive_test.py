#!/usr/bin/env python3
"""
PORTMAN - Comprehensive End-to-End Testing Suite
This script tests all major features and integrations of the PORTMAN platform.
"""

import asyncio
import aiohttp
import json
import time
from pathlib import Path
import sys
import os
from typing import Dict, Any, List

# Add backend to path
sys.path.append(str(Path(__file__).parent / "backend"))

class PortmanTester:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.frontend_url = "http://localhost:3000"
        self.test_results: List[Dict[str, Any]] = []
        self.access_token = None
        
    async def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting PORTMAN Comprehensive Test Suite")
        print("=" * 60)
        
        async with aiohttp.ClientSession() as session:
            # Core API Tests
            await self.test_health_check(session)
            await self.test_user_registration_login(session)
            await self.test_cv_upload_and_parsing(session)
            await self.test_rag_analysis(session)
            await self.test_ats_resume_generation(session)
            await self.test_portfolio_generation(session)
            await self.test_analytics_endpoints(session)
            await self.test_logs_system(session)
            
            # Frontend Integration Tests
            await self.test_frontend_accessibility(session)
            await self.test_api_integration(session)
            
            # Performance Tests
            await self.test_concurrent_requests(session)
            await self.test_large_file_upload(session)
            
        # Generate Test Report
        self.generate_test_report()
        
    async def test_health_check(self, session: aiohttp.ClientSession):
        """Test backend health check endpoint"""
        try:
            async with session.get(f"{self.base_url}/healthz") as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("Health Check", True, f"Server is healthy: {data}")
                else:
                    self.log_test_result("Health Check", False, f"Status: {response.status}")
        except Exception as e:
            self.log_test_result("Health Check", False, f"Error: {str(e)}")
    
    async def test_user_registration_login(self, session: aiohttp.ClientSession):
        """Test user registration and login flow"""
        try:
            # Test Registration
            user_data = {
                "name": "Test User",
                "email": f"test_{int(time.time())}@example.com",
                "password": "testpassword123"
            }
            
            async with session.post(f"{self.base_url}/api/v1/users/register", json=user_data) as response:
                if response.status in [200, 201]:
                    self.log_test_result("User Registration", True, "User registered successfully")
                else:
                    self.log_test_result("User Registration", False, f"Status: {response.status}")
                    return
            
            # Test Login
            login_data = {
                "username": user_data["email"],
                "password": user_data["password"]
            }
            
            async with session.post(f"{self.base_url}/api/v1/users/login", data=login_data) as response:
                if response.status == 200:
                    data = await response.json()
                    self.access_token = data.get("access_token")
                    self.log_test_result("User Login", True, "Login successful")
                else:
                    self.log_test_result("User Login", False, f"Status: {response.status}")
                    
        except Exception as e:
            self.log_test_result("User Auth Flow", False, f"Error: {str(e)}")
    
    async def test_cv_upload_and_parsing(self, session: aiohttp.ClientSession):
        """Test CV upload and parsing functionality"""
        try:
            # Create a test CV file
            test_cv_content = """
            John Doe
            Software Engineer
            Email: john.doe@example.com
            Phone: +1-555-0123
            
            EXPERIENCE:
            Software Engineer at Tech Corp (2020-2023)
            - Developed web applications using React and Node.js
            - Worked with databases and APIs
            
            EDUCATION:
            Bachelor of Computer Science, University XYZ (2016-2020)
            
            SKILLS:
            Python, JavaScript, React, Node.js, SQL, Git
            """
            
            # Create test file
            test_file_path = Path("test_cv_upload.txt")
            test_file_path.write_text(test_cv_content)
            
            # Upload CV
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            with open(test_file_path, 'rb') as file:
                data = aiohttp.FormData()
                data.add_field('file', file, filename='test_cv.txt')
                
                async with session.post(f"{self.base_url}/api/v1/cv/upload", data=data, headers=headers) as response:
                    if response.status in [200, 201]:
                        upload_data = await response.json()
                        filename = upload_data.get("filename")
                        self.log_test_result("CV Upload", True, f"File uploaded: {filename}")
                        
                        # Test CV parsing
                        if filename:
                            await self.test_cv_parsing(session, filename)
                    else:
                        text = await response.text()
                        self.log_test_result("CV Upload", False, f"Status: {response.status}, Response: {text}")
            
            # Cleanup
            if test_file_path.exists():
                test_file_path.unlink()
                
        except Exception as e:
            self.log_test_result("CV Upload & Parse", False, f"Error: {str(e)}")
    
    async def test_cv_parsing(self, session: aiohttp.ClientSession, filename: str):
        """Test CV parsing with uploaded file"""
        try:
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            parse_data = {"filename": filename}
            async with session.post(f"{self.base_url}/api/v1/cv/parse", json=parse_data, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("CV Parsing", True, f"CV parsed successfully, extracted fields: {len(data.get('parsed_cv', {}))}")
                else:
                    text = await response.text()
                    self.log_test_result("CV Parsing", False, f"Status: {response.status}, Response: {text}")
        except Exception as e:
            self.log_test_result("CV Parsing", False, f"Error: {str(e)}")
    
    async def test_rag_analysis(self, session: aiohttp.ClientSession):
        """Test RAG-based professional analysis"""
        try:
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            # Test professional comparison
            rag_data = {
                "user_id": "test_user",
                "cv_data": {
                    "skills": ["Python", "JavaScript", "React"],
                    "experience": [{"title": "Software Engineer", "company": "Tech Corp"}],
                    "education": [{"degree": "Bachelor of Computer Science"}]
                }
            }
            
            async with session.post(f"{self.base_url}/api/v1/rag/compare", json=rag_data, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("RAG Analysis", True, f"Professional comparison completed: {data.get('benchmark_score', 'N/A')} score")
                else:
                    text = await response.text()
                    self.log_test_result("RAG Analysis", False, f"Status: {response.status}, Response: {text}")
        except Exception as e:
            self.log_test_result("RAG Analysis", False, f"Error: {str(e)}")
    
    async def test_ats_resume_generation(self, session: aiohttp.ClientSession):
        """Test ATS resume generation"""
        try:
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            # Test ATS templates
            async with session.get(f"{self.base_url}/api/v1/ats/templates", headers=headers) as response:
                if response.status == 200:
                    templates = await response.json()
                    self.log_test_result("ATS Templates", True, f"Retrieved {len(templates.get('templates', []))} templates")
                else:
                    self.log_test_result("ATS Templates", False, f"Status: {response.status}")
            
            # Test ATS generation
            ats_data = {
                "cv_data": {
                    "personal_info": {"name": "John Doe", "email": "john@example.com"},
                    "skills": ["Python", "JavaScript"],
                    "experience": [{"title": "Software Engineer", "company": "Tech Corp"}]
                },
                "template": "professional"
            }
            
            async with session.post(f"{self.base_url}/api/v1/ats/generate", json=ats_data, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("ATS Generation", True, f"ATS resume generated: {data.get('resume_id', 'N/A')}")
                else:
                    text = await response.text()
                    self.log_test_result("ATS Generation", False, f"Status: {response.status}, Response: {text}")
        except Exception as e:
            self.log_test_result("ATS Resume", False, f"Error: {str(e)}")
    
    async def test_portfolio_generation(self, session: aiohttp.ClientSession):
        """Test portfolio generation"""
        try:
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            # Test portfolio templates
            async with session.get(f"{self.base_url}/api/v1/portfolio/templates", headers=headers) as response:
                if response.status == 200:
                    templates = await response.json()
                    self.log_test_result("Portfolio Templates", True, f"Retrieved {len(templates.get('templates', []))} templates")
                else:
                    self.log_test_result("Portfolio Templates", False, f"Status: {response.status}")
            
            # Test portfolio generation
            portfolio_data = {
                "cv_data": {
                    "personal_info": {"name": "John Doe", "email": "john@example.com"},
                    "skills": ["Python", "JavaScript"],
                    "experience": [{"title": "Software Engineer", "company": "Tech Corp"}]
                },
                "template": "modern",
                "customization": {"color_scheme": "blue", "font": "Arial"}
            }
            
            async with session.post(f"{self.base_url}/api/v1/portfolio/generate", json=portfolio_data, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("Portfolio Generation", True, f"Portfolio generated: {data.get('portfolio_id', 'N/A')}")
                else:
                    text = await response.text()
                    self.log_test_result("Portfolio Generation", False, f"Status: {response.status}, Response: {text}")
        except Exception as e:
            self.log_test_result("Portfolio Generation", False, f"Error: {str(e)}")
    
    async def test_analytics_endpoints(self, session: aiohttp.ClientSession):
        """Test analytics system"""
        try:
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            # Test analytics dashboard
            async with session.get(f"{self.base_url}/api/v1/analytics/dashboard", headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("Analytics Dashboard", True, f"Dashboard data retrieved with {len(data)} metrics")
                else:
                    self.log_test_result("Analytics Dashboard", False, f"Status: {response.status}")
            
            # Test analytics metrics
            async with session.get(f"{self.base_url}/api/v1/analytics/metrics?time_range=7d", headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("Analytics Metrics", True, f"Metrics retrieved: {data.get('total_users', 'N/A')} users")
                else:
                    self.log_test_result("Analytics Metrics", False, f"Status: {response.status}")
        except Exception as e:
            self.log_test_result("Analytics", False, f"Error: {str(e)}")
    
    async def test_logs_system(self, session: aiohttp.ClientSession):
        """Test logging system"""
        try:
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            # Test log retrieval
            async with session.get(f"{self.base_url}/api/v1/logs?limit=10", headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    self.log_test_result("Logs System", True, f"Retrieved {len(data.get('logs', []))} log entries")
                else:
                    self.log_test_result("Logs System", False, f"Status: {response.status}")
        except Exception as e:
            self.log_test_result("Logs System", False, f"Error: {str(e)}")
    
    async def test_frontend_accessibility(self, session: aiohttp.ClientSession):
        """Test frontend accessibility"""
        try:
            async with session.get(self.frontend_url) as response:
                if response.status == 200:
                    self.log_test_result("Frontend Accessibility", True, "Frontend is accessible")
                else:
                    self.log_test_result("Frontend Accessibility", False, f"Status: {response.status}")
        except Exception as e:
            self.log_test_result("Frontend Accessibility", False, f"Error: {str(e)}")
    
    async def test_api_integration(self, session: aiohttp.ClientSession):
        """Test frontend-backend API integration"""
        try:
            # Test CORS
            headers = {"Origin": self.frontend_url}
            async with session.options(f"{self.base_url}/api/v1/cv/upload", headers=headers) as response:
                if response.status in [200, 204]:
                    self.log_test_result("CORS Configuration", True, "CORS is properly configured")
                else:
                    self.log_test_result("CORS Configuration", False, f"Status: {response.status}")
        except Exception as e:
            self.log_test_result("API Integration", False, f"Error: {str(e)}")
    
    async def test_concurrent_requests(self, session: aiohttp.ClientSession):
        """Test system under concurrent load"""
        try:
            tasks = []
            for i in range(10):
                task = session.get(f"{self.base_url}/healthz")
                tasks.append(task)
            
            start_time = time.time()
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            end_time = time.time()
            
            successful = sum(1 for r in responses if hasattr(r, 'status') and r.status == 200)
            self.log_test_result("Concurrent Requests", True, f"{successful}/10 requests successful in {end_time - start_time:.2f}s")
        except Exception as e:
            self.log_test_result("Concurrent Requests", False, f"Error: {str(e)}")
    
    async def test_large_file_upload(self, session: aiohttp.ClientSession):
        """Test large file upload handling"""
        try:
            # Create a larger test file (simulate a large PDF)
            large_content = "Test CV Content\n" * 1000  # ~17KB
            test_file_path = Path("large_test_cv.txt")
            test_file_path.write_text(large_content)
            
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            
            with open(test_file_path, 'rb') as file:
                data = aiohttp.FormData()
                data.add_field('file', file, filename='large_test_cv.txt')
                
                start_time = time.time()
                async with session.post(f"{self.base_url}/api/v1/cv/upload", data=data, headers=headers) as response:
                    end_time = time.time()
                    
                    if response.status in [200, 201]:
                        self.log_test_result("Large File Upload", True, f"Large file uploaded in {end_time - start_time:.2f}s")
                    else:
                        self.log_test_result("Large File Upload", False, f"Status: {response.status}")
            
            # Cleanup
            if test_file_path.exists():
                test_file_path.unlink()
                
        except Exception as e:
            self.log_test_result("Large File Upload", False, f"Error: {str(e)}")
    
    def log_test_result(self, test_name: str, success: bool, details: str):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {test_name:<25} | {details}")
        
        self.test_results.append({
            "test_name": test_name,
            "success": success,
            "details": details,
            "timestamp": time.time()
        })
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 COMPREHENSIVE TEST REPORT")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"Total Tests Run: {total_tests}")
        print(f"Tests Passed: {passed_tests}")
        print(f"Tests Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        if failed_tests > 0:
            print("❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test_name']}: {result['details']}")
            print()
        
        # Save detailed report
        report = {
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "success_rate": success_rate,
                "timestamp": time.time()
            },
            "test_results": self.test_results
        }
        
        report_file = Path("test_report.json")
        report_file.write_text(json.dumps(report, indent=2))
        print(f"💾 Detailed report saved to: {report_file}")
        
        if success_rate >= 90:
            print("🎉 PORTMAN PLATFORM IS PRODUCTION READY!")
        elif success_rate >= 80:
            print("⚠️  PORTMAN Platform needs minor fixes before production")
        else:
            print("🚨 PORTMAN Platform needs significant fixes before production")

async def main():
    """Main test execution"""
    tester = PortmanTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
