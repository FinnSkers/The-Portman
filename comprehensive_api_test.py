#!/usr/bin/env python3
"""
Comprehensive API testing for the modern PORTMAN backend
"""

import json
import time
import requests
from typing import Dict, Any

class PortmanAPITester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None

    def test_health(self) -> bool:
        """Test the health endpoint."""
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health check passed: {data}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

    def test_docs_available(self) -> bool:
        """Test if API documentation is available."""
        try:
            response = self.session.get(f"{self.base_url}/docs")
            if response.status_code == 200:
                print("✅ API documentation is available at /docs")
                return True
            else:
                print(f"❌ API docs not available: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ API docs error: {e}")
            return False

    def test_api_v1_routes(self) -> bool:
        """Test API v1 routes availability."""
        try:
            # Test the root API endpoint
            response = self.session.get(f"{self.base_url}/api/v1/")
            print(f"📊 API v1 root response: {response.status_code}")
            
            # Test auth endpoints structure
            auth_endpoints = [
                "/api/v1/auth/register",
                "/api/v1/auth/login", 
                "/api/v1/users/me"
            ]
            
            available_endpoints = []
            for endpoint in auth_endpoints:
                response = self.session.get(f"{self.base_url}{endpoint}")
                if response.status_code in [200, 422, 401]:  # 422 = validation error (expected), 401 = unauthorized (expected)
                    available_endpoints.append(endpoint)
            
            print(f"✅ Available API endpoints: {available_endpoints}")
            return len(available_endpoints) > 0
            
        except Exception as e:
            print(f"❌ API routes test error: {e}")
            return False

    def test_user_registration(self) -> bool:
        """Test user registration flow."""
        try:
            user_data = {
                "email": "test@portman.dev",
                "password": "TestPassword123!",
                "full_name": "Test User"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/register",
                json=user_data
            )
            
            if response.status_code in [200, 201]:
                data = response.json()
                print(f"✅ User registration successful: {data.get('email')}")
                return True
            elif response.status_code == 400:
                print("ℹ️ User may already exist (expected for repeated tests)")
                return True
            else:
                print(f"❌ User registration failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ User registration error: {e}")
            return False

    def test_user_login(self) -> bool:
        """Test user login flow."""
        try:
            login_data = {
                "username": "test@portman.dev",  # FastAPI OAuth2 uses 'username' field
                "password": "TestPassword123!"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/v1/auth/login",
                data=login_data  # OAuth2 expects form data
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get("access_token")
                self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                print(f"✅ User login successful, token received")
                return True
            else:
                print(f"❌ User login failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ User login error: {e}")
            return False

    def run_comprehensive_test(self) -> Dict[str, bool]:
        """Run all tests and return results."""
        print("🚀 Starting comprehensive PORTMAN API tests...\n")
        
        # Wait for server to be ready
        print("⏳ Waiting for server to be ready...")
        time.sleep(3)
        
        results = {
            "health": self.test_health(),
            "docs": self.test_docs_available(),
            "api_routes": self.test_api_v1_routes(),
            "user_registration": self.test_user_registration(),
            "user_login": self.test_user_login(),
        }
        
        print(f"\n📊 Test Results Summary:")
        for test_name, passed in results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"  {test_name}: {status}")
        
        total_tests = len(results)
        passed_tests = sum(results.values())
        print(f"\n🎯 Overall: {passed_tests}/{total_tests} tests passed")
        
        return results

if __name__ == "__main__":
    tester = PortmanAPITester()
    results = tester.run_comprehensive_test()
