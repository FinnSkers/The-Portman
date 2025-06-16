import sqlalchemy
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:portman@db.ywfalggkhmdltsiceqqj.supabase.co:5432/postgres')

with engine.connect() as conn:
    # Get all tables
    result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    tables = [row[0] for row in result]
    print('Tables in Supabase:', tables)
    
    # Check users table data
    if 'users' in tables:
        user_result = conn.execute(text("SELECT id, username, email, full_name, created_at FROM users"))
        users = user_result.fetchall()
        print(f'\nUsers table ({len(users)} rows):')
        for user in users:
            print(f'  ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Name: {user[3]}, Created: {user[4]}')
    
    # Check if user has CV data
    if 'users' in tables:
        cv_result = conn.execute(text("SELECT username, full_name, phone, summary FROM users WHERE full_name IS NOT NULL"))
        cv_users = cv_result.fetchall()
        print(f'\nUsers with CV data ({len(cv_users)} rows):')
        for cv_user in cv_users:
            print(f'  Username: {cv_user[0]}, Name: {cv_user[1]}, Phone: {cv_user[2]}')
            print(f'  Summary: {cv_user[3][:100]}...' if cv_user[3] and len(cv_user[3]) > 100 else f'  Summary: {cv_user[3]}')
