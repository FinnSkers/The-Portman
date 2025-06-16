#!/usr/bin/env python3
"""
Check database schema vs model and create migration for missing columns
"""
import os
import sys
from dotenv import load_dotenv

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Now import database modules
from database import engine, SessionLocal
from models import User
from sqlalchemy import inspect

def check_user_schema():
    """Check User table schema and identify missing columns"""
    try:
        inspector = inspect(engine)
        db_columns = inspector.get_columns('users')
        db_column_names = {col['name'] for col in db_columns}
        
        print("🔍 Database columns in users table:")
        for col in sorted(db_column_names):
            print(f"  - {col}")
        
        # Get model columns
        model_columns = set()
        for column in User.__table__.columns:
            model_columns.add(column.name)
        
        print("\n🏗️  Model expects these columns:")
        for col in sorted(model_columns):
            print(f"  - {col}")
        
        # Find missing columns
        missing_in_db = model_columns - db_column_names
        extra_in_db = db_column_names - model_columns
        
        if missing_in_db:
            print(f"\n❌ Missing columns in database:")
            for col in sorted(missing_in_db):
                print(f"  - {col}")
        
        if extra_in_db:
            print(f"\n⚠️  Extra columns in database (not in model):")
            for col in sorted(extra_in_db):
                print(f"  - {col}")
        
        if not missing_in_db:
            print("\n✅ All model columns exist in database!")
        
        return missing_in_db, extra_in_db
        
    except Exception as e:
        print(f"❌ Error checking schema: {e}")
        return set(), set()

if __name__ == "__main__":
    check_user_schema()
