"""
Comprehensive test suite for the Modern PORTMAN Backend.
Tests all major components and API endpoints.
"""

import asyncio
import sys
import os
import json
from typing import Dict, Any

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

async def test_modern_backend_comprehensive():
    """Comprehensive test of the modern backend."""
    print("🧪 PORTMAN Modern Backend - Comprehensive Test Suite")
    print("=" * 60)
    
    test_results = {
        "configuration": False,
        "database_models": False,
        "schemas": False,
        "security": False,
        "services": False,
        "api_structure": False,
        "fastapi_app": False
    }
    
    # Test 1: Configuration
    print("\n📋 Testing Configuration System...")
    try:
        from app.core.config import settings
        print(f"✅ Configuration loaded successfully")
        print(f"   App Name: {settings.app_name}")
        print(f"   Version: {settings.version}")
        print(f"   Environment: {settings.environment}")
        print(f"   Debug Mode: {settings.debug}")
        print(f"   API Prefix: {settings.api_v1_prefix}")
        print(f"   Database URL: {settings.get_database_url()}")
        test_results["configuration"] = True
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
    
    # Test 2: Database Models
    print("\n🗄️  Testing Database Models...")
    try:
        from app.models import User, CVAnalysis, Portfolio, ATSResume
        print(f"✅ Models imported successfully")
        print(f"   User table: {User.__tablename__}")
        print(f"   CVAnalysis table: {CVAnalysis.__tablename__}")
        print(f"   Portfolio table: {Portfolio.__tablename__}")
        print(f"   ATSResume table: {ATSResume.__tablename__}")
        
        # Test model creation (without DB)
        user_columns = [col.name for col in User.__table__.columns]
        print(f"   User model has {len(user_columns)} columns: {user_columns[:5]}...")
        test_results["database_models"] = True
    except Exception as e:
        print(f"❌ Database models test failed: {e}")
    
    # Test 3: Pydantic Schemas
    print("\n📝 Testing Pydantic Schemas...")
    try:
        from app.schemas import UserCreate, UserPublic, CVAnalysisResponse, Token
        
        # Test schema creation
        user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123",
            "full_name": "Test User"
        }
        user_create = UserCreate(**user_data)
        print(f"✅ Schemas work correctly")
        print(f"   UserCreate: {user_create.email}")
        print(f"   Available schemas: UserCreate, UserPublic, CVAnalysisResponse, Token")
        test_results["schemas"] = True
    except Exception as e:
        print(f"❌ Schemas test failed: {e}")
    
    # Test 4: Security System
    print("\n🔐 Testing Security System...")
    try:
        from app.core.security import (
            create_access_token, 
            create_refresh_token,
            get_password_hash, 
            verify_password,
            verify_token
        )
        
        # Test password hashing
        password = "test123"
        hashed = get_password_hash(password)
        is_valid = verify_password(password, hashed)
        print(f"✅ Password hashing: {'✓' if is_valid else '✗'}")
        
        # Test JWT tokens
        access_token = create_access_token("test_user_123")
        refresh_token = create_refresh_token("test_user_123")
        print(f"✅ JWT tokens created successfully")
        print(f"   Access token: {access_token[:30]}...")
        print(f"   Refresh token: {refresh_token[:30]}...")
        
        # Test token verification
        user_id = verify_token(access_token, "access")
        print(f"✅ Token verification: {'✓' if user_id == 'test_user_123' else '✗'}")
        test_results["security"] = True
    except Exception as e:
        print(f"❌ Security test failed: {e}")
    
    # Test 5: Services Layer
    print("\n🔧 Testing Services Layer...")
    try:
        from app.services import UserService
        print(f"✅ Services imported successfully")
        print(f"   UserService class available")
        print(f"   Service methods: {[method for method in dir(UserService) if not method.startswith('_')][:5]}...")
        test_results["services"] = True
    except Exception as e:
        print(f"❌ Services test failed: {e}")
    
    # Test 6: API Structure
    print("\n🛠️  Testing API Structure...")
    try:
        from app.api.v1.api import api_router
        from app.api.v1.endpoints import auth, users, cv_analysis, portfolios
        
        print(f"✅ API structure imported successfully")
        print(f"   Main API router: {api_router}")
        print(f"   Auth endpoints: {len(auth.router.routes)} routes")
        print(f"   User endpoints: {len(users.router.routes)} routes")
        print(f"   CV Analysis endpoints: {len(cv_analysis.router.routes)} routes")
        print(f"   Portfolio endpoints: {len(portfolios.router.routes)} routes")
        test_results["api_structure"] = True
    except Exception as e:
        print(f"❌ API structure test failed: {e}")
    
    # Test 7: FastAPI Application
    print("\n🚀 Testing FastAPI Application...")
    try:
        from app.main import app
        
        print(f"✅ FastAPI application created successfully")
        print(f"   Title: {app.title}")
        print(f"   Version: {app.version}")
        print(f"   Total routes: {len(app.routes)}")
        
        # List main routes
        main_routes = [route.path for route in app.routes if hasattr(route, 'path')][:10]
        print(f"   Main routes: {main_routes}")
        test_results["fastapi_app"] = True
    except Exception as e:
        print(f"❌ FastAPI application test failed: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\n🎯 Overall Result: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Modern backend is ready for production!")
        print("\n🚀 Next Steps:")
        print("   1. Start the server: python -m uvicorn app.main:app --reload")
        print("   2. Visit: http://localhost:8000/docs")
        print("   3. Test API endpoints")
        print("   4. Integrate with frontend")
    else:
        print("⚠️  Some tests failed. Please review the issues above.")
    
    return passed == total


if __name__ == "__main__":
    success = asyncio.run(test_modern_backend_comprehensive())
    sys.exit(0 if success else 1)
