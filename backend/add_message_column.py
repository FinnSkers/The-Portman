#!/usr/bin/env python3
"""
Add message column to system_logs table
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(__file__))

from database import engine
from sqlalchemy import text

def add_message_column():
    """Add message column to system_logs table"""
    try:
        with engine.connect() as connection:
            print("Adding message column to system_logs table...")
            
            try:
                connection.execute(text("ALTER TABLE system_logs ADD COLUMN message TEXT;"))
                connection.commit()
                print("✅ Added message column to system_logs")
            except Exception as e:
                if "already exists" in str(e):
                    print("ℹ️  message column already exists")
                else:
                    print(f"❌ Error adding message column: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    add_message_column()
