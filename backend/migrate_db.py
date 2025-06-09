#!/usr/bin/env python3
"""
Migration script to add password reset columns to existing users table
"""

import os
import sqlite3

def migrate_database():
    """Add password reset columns to the users table"""
    db_path = "portman.db"
    
    # Check if database exists
    if not os.path.exists(db_path):
        print("Database doesn't exist yet. It will be created with the new schema.")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'reset_token' not in columns:
            print("Adding reset_token column...")
            cursor.execute("ALTER TABLE users ADD COLUMN reset_token TEXT")
        else:
            print("reset_token column already exists")
            
        if 'reset_token_expires_at' not in columns:
            print("Adding reset_token_expires_at column...")
            cursor.execute("ALTER TABLE users ADD COLUMN reset_token_expires_at TIMESTAMP")
        else:
            print("reset_token_expires_at column already exists")
        
        conn.commit()
        print("✅ Database migration completed successfully!")
        
        # Show current table structure
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        print("\nCurrent users table structure:")
        for col in columns:
            print(f"  {col[1]} ({col[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    print("Running database migration...")
    migrate_database()
