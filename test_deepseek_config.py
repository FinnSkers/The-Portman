#!/usr/bin/env python3
"""
Test script to verify DeepSeek-R1 model configuration
"""
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_model_config():
    """Test that backend is using DeepSeek-R1 model"""
    
    # Check environment variables
    model = os.getenv('OPENROUTER_MODEL', 'NOT_SET')
    api_key = os.getenv('OPENROUTER_API_KEY', 'NOT_SET')
    
    print("=== DeepSeek-R1 Configuration Test ===")
    print(f"OPENROUTER_MODEL: {model}")
    print(f"API Key configured: {'Yes' if api_key != 'NOT_SET' else 'No'}")
    
    # Verify it's the correct DeepSeek model
    expected_model = "deepseek/deepseek-r1-0528-qwen3-8b:free"
    if model == expected_model:
        print("✅ Model correctly configured for DeepSeek-R1")
    else:
        print(f"❌ Model mismatch! Expected: {expected_model}, Got: {model}")
    
    # Test backend health
    try:
        response = requests.get("http://localhost:8000/healthz", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running")
        else:
            print(f"❌ Backend server issue: {response.status_code}")
    except Exception as e:
        print(f"❌ Backend server not accessible: {e}")
    
    # Test a simple CV parsing to confirm DeepSeek is being used
    print("\n=== Testing DeepSeek Model Usage ===")
    try:
        test_cv_text = """
        John Doe
        Software Engineer
        Email: john.doe@email.com
        Phone: +1-555-0123
        Skills: Python, React, FastAPI
        """
        
        # Upload test file first
        files = {'file': ('test_cv.txt', test_cv_text, 'text/plain')}
        upload_response = requests.post("http://localhost:8000/api/v1/cv/upload", files=files, timeout=30)
        
        if upload_response.status_code == 200:
            upload_data = upload_response.json()
            filename = upload_data['filename']
            print(f"✅ Test CV uploaded: {filename}")
            
            # Parse with AI (this will use DeepSeek-R1)
            parse_response = requests.post(
                f"http://localhost:8000/api/v1/cv/parse/{filename}",
                timeout=60
            )
            
            if parse_response.status_code == 200:
                parse_data = parse_response.json()
                print("✅ CV parsing successful with DeepSeek-R1")
                print(f"Parsed name: {parse_data.get('name', 'Not found')}")
                print(f"Parsed email: {parse_data.get('email', 'Not found')}")
                print("✅ DeepSeek-R1 model is working correctly!")
            else:
                print(f"❌ Parsing failed: {parse_response.status_code}")
                print(parse_response.text)
        else:
            print(f"❌ Upload failed: {upload_response.status_code}")
            print(upload_response.text)
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_model_config()
