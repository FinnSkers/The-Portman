#!/usr/bin/env python3
"""
Add missing columns directly to Supabase
"""
import os
import sys
from dotenv import load_dotenv

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Now import database modules
from database import engine

def add_missing_columns():
    """Add missing columns to users table"""
    try:
        from sqlalchemy import text
        
        with engine.connect() as connection:
            print("Adding missing columns to users table...")
            
            # Add avatar_url column
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR;"))
                print("✅ Added avatar_url column")
            except Exception as e:
                if "already exists" in str(e):
                    print("ℹ️  avatar_url column already exists")
                else:
                    print(f"❌ Error adding avatar_url: {e}")
            
            # Add bio column
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN bio TEXT;"))
                print("✅ Added bio column")
            except Exception as e:
                if "already exists" in str(e):
                    print("ℹ️  bio column already exists")
                else:
                    print(f"❌ Error adding bio: {e}")
            
            # Add is_premium column
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;"))
                print("✅ Added is_premium column")
            except Exception as e:
                if "already exists" in str(e):
                    print("ℹ️  is_premium column already exists")
                else:
                    print(f"❌ Error adding is_premium: {e}")
            
            # Add last_login column
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN last_login TIMESTAMP;"))
                print("✅ Added last_login column")
            except Exception as e:
                if "already exists" in str(e):
                    print("ℹ️  last_login column already exists")
                else:
                    print(f"❌ Error adding last_login: {e}")
            
            connection.commit()
            print("\n✅ All missing columns added successfully!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding columns: {e}")
        return False

if __name__ == "__main__":
    add_missing_columns()
