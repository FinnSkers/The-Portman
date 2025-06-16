#!/usr/bin/env python3
"""
Create all database tables for Supabase
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
from models import Base, User, Portfolio, UploadedFile, UserAnalytics, SystemLog, AIJob, Subscription

def create_tables():
    """Create all tables in the database"""
    try:
        print("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Verify tables exist
        db = SessionLocal()
        try:
            # Try to query the User table
            user_count = db.query(User).count()
            print(f"✅ Users table accessible, contains {user_count} users")
        except Exception as e:
            print(f"⚠️  Issue with Users table: {e}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    return True

if __name__ == "__main__":
    create_tables()
