#!/usr/bin/env python3
"""
Script to create an admin user for testing purposes.
Run this script to create an admin user with email 'admin@portman.com' and password 'admin123'
"""

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from datetime import datetime

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import User, Base

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portman.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    """Create or reset the admin user for testing"""
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "admin@portman.com").first()
        hashed_password = pwd_context.hash("admin123")
        if admin_user:
            # Always reset all fields
            setattr(admin_user, 'username', 'admin')
            setattr(admin_user, 'email', 'admin@portman.com')
            setattr(admin_user, 'hashed_password', hashed_password)
            setattr(admin_user, 'is_admin', True)
            setattr(admin_user, 'is_active', True)
            db.commit()
            db.refresh(admin_user)
            print("Admin user already exists! All fields have been reset.")
            print(f"Email: {admin_user.email}")
            print(f"Username: {admin_user.username}")
            print(f"Is Admin: {admin_user.is_admin}")
            print(f"Password: admin123")
            return
        
        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@portman.com",
            hashed_password=hashed_password,
            is_active=True,
            is_admin=True,
            created_at=datetime.utcnow()
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Password: admin123")
        print(f"Username: {admin_user.username}")
        print(f"Is Admin: {admin_user.is_admin}")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def create_test_user():
    """Create a regular test user"""
    db = SessionLocal()
    try:
        # Check if test user already exists
        test_user = db.query(User).filter(User.email == "test@portman.com").first()
        if test_user:
            print("Test user already exists!")
            return
        
        # Create test user
        hashed_password = pwd_context.hash("test123")
        test_user = User(
            username="testuser",
            email="test@portman.com",
            hashed_password=hashed_password,
            is_active=True,
            is_admin=False,
            created_at=datetime.utcnow()
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print(f"Email: {test_user.email}")
        print(f"Password: test123")
        print(f"Username: {test_user.username}")
        print(f"Is Admin: {test_user.is_admin}")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating admin and test users...")
    create_admin_user()
    print()
    create_test_user()
    print()
    print("You can now log in to the application with these credentials:")
    print("Admin: admin@portman.com / admin123")
    print("User: test@portman.com / test123")
