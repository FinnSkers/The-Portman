import sys
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from database import SessionLocal
from main import User
from datetime import datetime
import json

# Create a test user with sample CV data
def create_test_data():
    db = SessionLocal()
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter_by(username="testuser").first()
        if existing_user:
            print("Test user already exists")
            return
        
        # Create test user with CV data
        test_user = User(
            username="testuser",
            email="test@example.com",
            hashed_password="$2b$12$sample_hashed_password",
            full_name="John Doe",
            phone="+1-234-567-8900",
            address="123 Main St, City, State 12345",
            summary="Experienced software developer with 5+ years in web development",
            experience_json=json.dumps([
                {
                    "company": "Tech Corp",
                    "position": "Senior Developer",
                    "duration": "2020-2024",
                    "description": "Led development of web applications"
                }
            ]),
            education_json=json.dumps([
                {
                    "institution": "University of Technology",
                    "degree": "Computer Science",
                    "year": "2019"
                }
            ]),
            skills_json=json.dumps(["Python", "JavaScript", "React", "FastAPI"]),
            languages_json=json.dumps(["English (Native)", "Spanish (Fluent)"]),
            certifications_json=json.dumps(["AWS Certified Developer"]),
            links_json=json.dumps(["https://github.com/johndoe", "https://linkedin.com/in/johndoe"]),
            cv_updated_at=datetime.utcnow()
        )
        
        db.add(test_user)
        db.commit()
        print("Test user created successfully!")
        
        # Verify the data
        user_count = db.query(User).count()
        print(f"Total users in database: {user_count}")
        
    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
