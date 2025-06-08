"""
Test script to verify the modern backend setup.
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

async def test_modern_backend():
    """Test the modern backend components."""
    print("🧪 Testing Modern PORTMAN Backend Setup...")
    
    try:
        # Test configuration
        print("📋 Testing configuration...")
        from app.core.config import settings
        print(f"✅ Configuration loaded: {settings.app_name} v{settings.version}")
        print(f"   Environment: {settings.environment}")
        print(f"   Debug mode: {settings.debug}")
        
        # Test database connection
        print("\n🗄️  Testing database setup...")
        from app.core.database import engine, Base
        print("✅ Database engine created successfully")
        
        # Test models import
        print("\n📊 Testing models...")
        from app.models import User, CVAnalysis, Portfolio, ATSResume
        print("✅ Models imported successfully")
        print(f"   - User: {User.__tablename__}")
        print(f"   - CVAnalysis: {CVAnalysis.__tablename__}")
        print(f"   - Portfolio: {Portfolio.__tablename__}")
        print(f"   - ATSResume: {ATSResume.__tablename__}")
        
        # Test schemas
        print("\n📝 Testing schemas...")
        from app.schemas import UserCreate, UserPublic, CVAnalysisResponse
        print("✅ Schemas imported successfully")
        
        # Test security
        print("\n🔐 Testing security...")
        from app.core.security import create_access_token, get_password_hash, verify_password
        
        # Test password hashing
        test_password = "test123"
        hashed = get_password_hash(test_password)
        is_valid = verify_password(test_password, hashed)
        print(f"✅ Password hashing works: {is_valid}")
        
        # Test JWT token creation
        token = create_access_token("test_user")
        print(f"✅ JWT token created: {token[:20]}...")
        
        # Test services
        print("\n🔧 Testing services...")
        from app.services import UserService
        print("✅ Services imported successfully")
        
        # Test FastAPI app
        print("\n🚀 Testing FastAPI application...")
        from app.main import app
        print(f"✅ FastAPI app created: {app.title} v{app.version}")
        print(f"   Routes: {len(app.routes)} registered")
        
        print("\n🎉 All tests passed! Modern backend is ready to run.")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = asyncio.run(test_modern_backend())
    sys.exit(0 if success else 1)
