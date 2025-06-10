#!/usr/bin/env python3
"""
Quick script to check admin login credentials
"""
import sys
import os
sys.path.append('.')

from main import User, engine
from auth_utils import verify_password
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
db = Session()

try:
    admin = db.query(User).filter(User.email == 'admin@portman.com').first()
    if admin:
        print(f"✅ Admin user found: {admin.username} ({admin.email})")
        print(f"   Is Admin: {admin.is_admin}")
        print(f"   Is Active: {admin.is_active}")
        
        # Test password verification
        password_check = verify_password('admin123', admin.hashed_password)
        print(f"   Password verification: {password_check}")
        
        if not password_check:
            print("❌ Password verification failed!")
            print("   Hash in database:", admin.hashed_password[:50] + "...")
            
    else:
        print("❌ Admin user not found!")
        
    # List all users
    users = db.query(User).all()
    print(f"\n📋 All users ({len(users)}):")
    for user in users:
        print(f"   - {user.username} ({user.email}) - Admin: {user.is_admin}, Active: {user.is_active}")
        
finally:
    db.close()
