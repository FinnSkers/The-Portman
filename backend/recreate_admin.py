#!/usr/bin/env python3
"""
Recreate admin account with proper password hashing
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(__file__))

from database import SessionLocal
from models import User
from auth_utils import get_password_hash
from datetime import datetime

def recreate_admin():
    """Delete and recreate admin account with proper password hash"""
    print("🔄 Recreating admin account with proper password hash...")
    
    db = SessionLocal()
    try:
        # Delete existing admin account
        admin_user = db.query(User).filter(User.email == 'admin@portman.ai').first()
        if admin_user:
            db.delete(admin_user)
            db.commit()
            print("🗑️  Deleted existing admin account")
        
        # Create new admin account with proper password hash
        admin_password = "admin123"
        hashed_password = get_password_hash(admin_password)
        
        new_admin = User(
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
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        print("✅ New admin account created with proper password hash!")
        print(f"   Username: admin")
        print(f"   Password: {admin_password}")
        print(f"   Email: admin@portman.ai")
        print(f"   Is Admin: {new_admin.is_admin}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error recreating admin account: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    recreate_admin()
