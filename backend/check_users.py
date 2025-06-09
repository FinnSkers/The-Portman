#!/usr/bin/env python3
"""
Simple test to check database and create test user
"""
import sys
import os
sys.path.append('.')

from main import User, SessionLocal
from auth_utils import get_password_hash

def check_users():
    print("🔍 Checking current users in database...")
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"  - {user.username} ({user.email})")
        return users
    finally:
        db.close()

def create_test_user():
    print("\n➕ Creating fresh test user...")
    db = SessionLocal()
    try:
        # Delete existing test user if exists
        existing = db.query(User).filter(User.username == "testuser").first()
        if existing:
            db.delete(existing)
            db.commit()
            print("   Deleted existing test user")
        
        # Create new test user
        hashed_password = get_password_hash("testpassword123")
        new_user = User(
            username="testuser",
            email="testuser@example.com", 
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"✅ Created test user: {new_user.username} ({new_user.email})")
        return True
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return False
    finally:
        db.close()

def print_all_users():
    db = SessionLocal()
    users = db.query(User).all()
    print("\nCurrent users in database:")
    for user in users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Is Admin: {user.is_admin}")
        print(f"Is Active: {user.is_active}")
        print(f"Created At: {user.created_at}")
        print(f"Hashed Password: {user.hashed_password}")
        print("-"*40)
    db.close()

if __name__ == "__main__":
    check_users()
    create_test_user()
    check_users()
    print_all_users()
