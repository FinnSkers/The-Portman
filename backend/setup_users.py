#!/usr/bin/env python3
"""
Create test users using backend models
"""
import sys
import os

# Add current directory to path
sys.path.append('.')

def create_test_users():
    print("🚀 Creating test users for PORTMAN backend...")
    
    try:
        # Import backend modules
        from main import User, SessionLocal, Base, engine
        from auth_utils import get_password_hash
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created/verified")
        
        # Create database session
        db = SessionLocal()
        
        try:
            # Clear existing test users
            db.query(User).filter(User.username.in_(['admin', 'testuser'])).delete()
            db.commit()
            print("🧹 Cleared existing test users")
            
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@portman.dev",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_admin=True
            )
            db.add(admin_user)
            
            # Create test user  
            test_user = User(
                username="testuser",
                email="testuser@example.com",
                hashed_password=get_password_hash("testpassword123"),
                is_active=True,
                is_admin=False
            )
            db.add(test_user)
            
            # Commit changes
            db.commit()
            
            # Verify users were created
            users = db.query(User).all()
            print(f"\n✅ Created {len(users)} users:")
            for user in users:
                role = "Admin" if user.is_admin else "User"
                print(f"   - {user.username} ({user.email}) - {role}")
            
            print("\n🎉 Test users created successfully!")
            print("\n🔑 Test Credentials:")
            print("   👤 Admin: username=admin, password=admin123")
            print("   👤 User:  username=testuser, password=testpassword123")
            
            return True
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    create_test_users()
