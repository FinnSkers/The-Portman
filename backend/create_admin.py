import sys
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from database import SessionLocal
from main import User
from datetime import datetime
from auth_utils import get_password_hash  # Use proper password hashing

def create_admin_account():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter_by(username="admin").first()
        if existing_admin:
            print("Admin account already exists")
            print(f"Admin email: {existing_admin.email}")
            return existing_admin
          # Create admin account
        admin_password = "admin123"  # Change this in production!
        hashed_password = get_password_hash(admin_password)  # Use proper bcrypt hashing
        
        admin_user = User(
            username="admin",
            email="admin@portman.ai",
            hashed_password=hashed_password,
            is_active=True,
            is_admin=True,
            full_name="System Administrator",
            phone="+1-555-ADMIN",
            address="PORTMAN HQ",
            summary="System Administrator for PORTMAN AI platform",
            created_at=datetime.utcnow()
        )
        
        db.add(admin_user)
        db.commit()
        print("✅ Admin account created successfully!")
        print(f"Username: admin")
        print(f"Password: {admin_password}")
        print(f"Email: admin@portman.ai")
        
        return admin_user
        
    except Exception as e:
        print(f"❌ Error creating admin account: {e}")
        db.rollback()
        return None
    finally:
        db.close()

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\n📊 Total users in database: {len(users)}")
        for user in users:
            role = "Admin" if user.is_admin else "User"
            status = "Active" if user.is_active else "Inactive"
            print(f"  • {user.username} ({role}) - {user.email} - {status}")
    except Exception as e:
        print(f"❌ Error checking users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Creating admin account...")
    create_admin_account()
    check_users()
