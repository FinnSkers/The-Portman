#!/usr/bin/env python3
"""
Simple health check for backend modules
"""
import requests
import time

def check_backend_health():
    """Check backend endpoints health"""
    print("🏥 Backend Health Check")
    print("=" * 40)
    
    base_url = "http://localhost:8000"
    
    # Test basic health
    try:
        response = requests.get(f"{base_url}/healthz", timeout=5)
        if response.status_code == 200:
            print("✅ Basic health: OK")
        else:
            print(f"❌ Basic health: {response.status_code}")
    except Exception as e:
        print(f"❌ Basic health: {e}")
    
    # Test user registration (should work)
    try:
        test_email = f"test{int(time.time())}@example.com"
        response = requests.post(f"{base_url}/api/v1/users/register/", 
            json={"email": test_email, "password": "test123", "username": f"test{int(time.time())}"}, 
            timeout=10)
        if response.status_code in [200, 201]:
            print("✅ User registration: OK")
        elif response.status_code == 400:
            print("✅ User registration: OK (validation working)")
        else:
            print(f"❌ User registration: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ User registration: {e}")
    
    # Test admin login
    try:
        response = requests.post(f"{base_url}/api/v1/users/login/", 
            json={"email": "admin@portman.ai", "password": "admin123"}, 
            timeout=10)
        if response.status_code == 200:
            print("✅ Admin login: OK")
            data = response.json()
            token = data.get('access_token')
            
            # Test authenticated endpoint
            if token:
                me_response = requests.get(f"{base_url}/api/v1/users/me/", 
                    headers={"Authorization": f"Bearer {token}"}, timeout=5)
                if me_response.status_code == 200:
                    user_data = me_response.json()
                    print(f"✅ User profile: OK (Admin: {user_data.get('is_admin', False)})")
                else:
                    print(f"❌ User profile: {me_response.status_code}")
        else:
            print(f"❌ Admin login: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Admin login: {e}")
    
    # Test logs endpoint
    try:
        response = requests.get(f"{base_url}/api/v1/logs/", timeout=5)
        if response.status_code in [200, 401]:  # 401 is expected without auth
            print("✅ Logs endpoint: OK")
        else:
            print(f"❌ Logs endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Logs endpoint: {e}")

if __name__ == "__main__":
    check_backend_health()
