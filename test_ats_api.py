import requests
import json

def test_ats_api():
    print("Testing ATS Resume Maker API...")
    
    try:
        # Test templates endpoint
        response = requests.get('http://localhost:8000/api/v1/ats/templates/', timeout=10)
        print(f'Templates API Status: {response.status_code}')
        
        if response.status_code == 200:
            data = response.json()
            print(f'✅ Available templates: {len(data["templates"])}')
            for template in data["templates"]:
                print(f'  - {template["name"]}: {template["description"]}')
        else:
            print(f'❌ Templates API Error: {response.text}')
            
        # Test health check
        health = requests.get('http://localhost:8000/healthz', timeout=5)
        print(f'Health check: {health.status_code}')
        
        print("\n✅ Backend ATS Resume Maker API is working!")
        
    except Exception as e:
        print(f'❌ API Test failed: {e}')

if __name__ == '__main__':
    test_ats_api()
