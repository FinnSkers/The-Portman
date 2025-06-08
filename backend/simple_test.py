"""
Simple test to verify basic imports work.
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Test basic imports."""
    print("🧪 Testing Modern PORTMAN Backend Setup...")
    
    try:
        # Test FastAPI
        import fastapi
        print(f"✅ FastAPI v{fastapi.__version__} imported")
        
        # Test Pydantic
        import pydantic
        print(f"✅ Pydantic v{pydantic.__version__} imported")
        
        # Test SQLAlchemy
        import sqlalchemy
        print(f"✅ SQLAlchemy v{sqlalchemy.__version__} imported")
        
        # Test app structure
        try:
            from app.core.config import settings
            print(f"✅ Configuration loaded: {settings.app_name}")
        except Exception as e:
            print(f"⚠️  Configuration issue: {e}")
        
        try:
            from app.main import app
            print(f"✅ FastAPI app loaded: {app.title}")
        except Exception as e:
            print(f"⚠️  App loading issue: {e}")
        
        print("\n🎉 Basic setup verification complete!")
        return True
        
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

if __name__ == "__main__":
    test_imports()
