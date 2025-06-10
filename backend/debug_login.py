#!/usr/bin/env python3
"""
Debug admin login step by step
"""
import sys
import os
sys.path.append('.')

from main import User, engine
from auth_utils import verify_password, get_password_hash
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

Session = sessionmaker(bind=engine)

def debug_login(email: str, password: str):
    db = Session()
    try:
        print(f"🔍 Debugging login for: {email}")
        print(f"   Password: {password}")
        
        # Step 1: Find user
        user = db.query(User).filter(User.email == email).first()
        print(f"   User found: {user is not None}")
        
        if user:
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Is Admin: {user.is_admin}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Hash (first 20 chars): {user.hashed_password[:20]}...")
            
            # Step 2: Verify password
            password_valid = verify_password(password, user.hashed_password)
            print(f"   Password valid: {password_valid}")
            
            # Step 3: Check complete condition
            login_success = user and password_valid
            print(f"   Login should succeed: {login_success}")
            
            if not login_success:
                if not user:
                    print("❌ FAIL: User not found")
                elif not password_valid:
                    print("❌ FAIL: Password verification failed")
                else:
                    print("❌ FAIL: Unknown reason")
            else:
                print("✅ SUCCESS: Login should work")
                
                # Test token creation
                from auth_utils import create_access_token
                try:
                    token = create_access_token(data={"sub": user.username})
                    print(f"   Token created: {token[:20]}...")
                except Exception as e:
                    print(f"❌ Token creation failed: {e}")
        else:
            print("❌ User not found in database")
            
    except Exception as e:
        print(f"❌ Error during debug: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Admin Login Debug")
    print("===================")
    debug_login("admin@portman.com", "admin123")
    
    print("\n" + "="*50)
    print("🧪 Testing other potential emails/passwords:")
    
    # Test variations
    debug_login("admin", "admin123")  # Maybe username instead of email
    debug_login("admin@portman.dev", "admin123")  # Different domain
