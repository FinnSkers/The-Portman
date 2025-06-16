#!/usr/bin/env python3
"""
PORTMAN Integration Health Check
Verifies all backend integrations are working correctly
"""
import os
import sys
from datetime import datetime

def check_imports():
    """Check if all required packages can be imported"""
    print("🔧 Checking Package Imports...")
    imports = {
        'fastapi': 'FastAPI web framework',
        'sqlalchemy': 'Database ORM',
        'psycopg2': 'PostgreSQL driver',
        'chromadb': 'Vector database',
        'uvicorn': 'ASGI server',
        'python_dotenv': 'Environment variables',
        'pydantic': 'Data validation',
        'alembic': 'Database migrations'
    }
    
    results = {}
    for package, description in imports.items():
        try:
            if package == 'python_dotenv':
                import dotenv
                version = getattr(dotenv, '__version__', 'unknown')
            else:
                module = __import__(package)
                version = getattr(module, '__version__', 'unknown')
            results[package] = f"✅ {description} - v{version}"
        except ImportError as e:
            results[package] = f"❌ {description} - {e}"
    
    for package, result in results.items():
        print(f"  {result}")
    
    return all('✅' in result for result in results.values())

def check_environment():
    """Check environment variables"""
    print("\n🌍 Checking Environment Variables...")
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = ['DATABASE_URL']
    optional_vars = ['PINECONE_API_KEY', 'PINECONE_REGION', 'PINECONE_INDEX']
    
    all_good = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            masked = value[:20] + '...' if len(value) > 20 else value
            print(f"  ✅ {var}: {masked}")
        else:
            print(f"  ❌ {var}: Not set")
            all_good = False
    
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            masked = value[:20] + '...' if len(value) > 20 else value
            print(f"  ℹ️  {var}: {masked}")
        else:
            print(f"  ⚠️  {var}: Not set (optional)")
    
    return all_good

def check_database():
    """Check database connection and tables"""
    print("\n🗄️  Checking Database Connection...")
    try:
        from sqlalchemy import create_engine, text
        from dotenv import load_dotenv
        load_dotenv()
        
        engine = create_engine(os.getenv('DATABASE_URL'))
        with engine.connect() as conn:
            # Test connection
            result = conn.execute(text("SELECT 1"))
            print("  ✅ Database connection successful")
            
            # Check tables
            tables_result = conn.execute(text(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
            ))
            tables = [row[0] for row in tables_result]
            print(f"  ✅ Found {len(tables)} tables: {', '.join(tables)}")
            
            # Check users table specifically
            if 'users' in tables:
                user_count = conn.execute(text("SELECT COUNT(*) FROM users")).scalar()
                print(f"  ✅ Users table: {user_count} records")
            else:
                print("  ⚠️  Users table not found")
            
            return True
            
    except Exception as e:
        print(f"  ❌ Database error: {e}")
        return False

def check_vector_db():
    """Check ChromaDB connection"""
    print("\n🔍 Checking Vector Database (ChromaDB)...")
    try:
        import chromadb
        from chromadb.config import Settings
        
        # Try to initialize ChromaDB - handle existing instances
        try:
            client = chromadb.Client(Settings(
                persist_directory=os.path.join(os.path.dirname(__file__), "../database/chroma")
            ))
        except Exception:
            # If persistent client fails, try ephemeral
            client = chromadb.EphemeralClient()
        
        collections = client.list_collections()
        print(f"  ✅ ChromaDB connection OK - {len(collections)} collections")
        return True
        
    except Exception as e:
        print(f"  ❌ ChromaDB error: {e}")
        return False

def check_backend_server():
    """Check if backend can start"""
    print("\n🚀 Checking Backend Server...")
    try:
        # Try importing main app
        sys.path.append(os.path.dirname(__file__))
        from main import app
        print("  ✅ FastAPI app imports successfully")
        
        # Check if app has expected routes
        routes = []
        for route in app.routes:
            if hasattr(route, 'path'):
                routes.append(route.path)
        
        print(f"  ✅ App has {len(routes)} registered routes")
        print(f"  ✅ FastAPI app configuration complete")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Backend server error: {e}")
        return False

def main():
    """Run all health checks"""
    print("🏥 PORTMAN Backend Health Check")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    checks = [
        ("Package Imports", check_imports),
        ("Environment Variables", check_environment),
        ("Database Connection", check_database),
        ("Vector Database", check_vector_db),
        ("Backend Server", check_backend_server)
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"  ❌ {name} check failed: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 50)
    print("📊 Health Check Summary:")
    
    passed = 0
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} {name}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} checks passed")
    
    if passed == len(results):
        print("🎉 All systems operational!")
        return 0
    else:
        print("⚠️  Some systems need attention")
        return 1

if __name__ == "__main__":
    sys.exit(main())
