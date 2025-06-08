"""
Test script to verify the modern PORTMAN backend API endpoints.
"""

import requests
import json
import time

def test_backend_api():
    """Test the modern backend API endpoints."""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Modern PORTMAN Backend API...")
    
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    try:
        # Test health endpoint
        print("\n🔍 Testing health endpoint...")
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
        # Test root endpoint
        print("\n🔍 Testing root endpoint...")
        response = requests.get(f"{base_url}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint: {data}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            
        # Test API documentation
        print("\n🔍 Testing API documentation...")
        response = requests.get(f"{base_url}/docs", timeout=10)
        if response.status_code == 200:
            print("✅ API documentation is accessible")
        else:
            print(f"❌ API docs failed: {response.status_code}")
            
        # Test OpenAPI schema
        print("\n🔍 Testing OpenAPI schema...")
        response = requests.get(f"{base_url}/openapi.json", timeout=10)
        if response.status_code == 200:
            schema = response.json()
            print(f"✅ OpenAPI schema loaded with {len(schema.get('paths', {}))} endpoints")
            
            # Print available endpoints
            print("\n📋 Available API endpoints:")
            for path, methods in schema.get('paths', {}).items():
                for method in methods.keys():
                    print(f"   {method.upper()} {path}")
        else:
            print(f"❌ OpenAPI schema failed: {response.status_code}")
            
        # Test CORS
        print("\n🔍 Testing CORS headers...")
        response = requests.options(f"{base_url}/", timeout=10)
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        if cors_headers:
            print(f"✅ CORS headers present: {cors_headers}")
        else:
            print("⚠️  No CORS headers found")
            
        print("\n🎉 Modern backend API test completed successfully!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server. Is it running on port 8000?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Server might be slow to respond.")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_backend_api()
    if success:
        print("\n✨ Modern PORTMAN Backend is running successfully!")
    else:
        print("\n⚠️  Some issues detected with the backend.")
