#!/usr/bin/env python3
"""
Quick test to verify the modern FastAPI backend can start properly
"""

import asyncio
import sys
import traceback
from app.main import create_application

async def test_server_startup():
    """Test if the server can start without errors."""
    try:
        print("🚀 Testing PORTMAN Modern Backend Startup...")
        
        # Create the FastAPI application
        app = create_application()
        print(f"✅ FastAPI app created: {app.title} v{app.version}")
        
        # Test the lifespan context manager
        print("🔄 Testing application lifespan...")
        async with app.router.lifespan_context(app) as lifespan:
            print("✅ Application lifespan context created successfully")
        
        print("✅ Server startup test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during server startup test: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_server_startup())
    sys.exit(0 if success else 1)
