import sqlalchemy
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:portman@db.ywfalggkhmdltsiceqqj.supabase.co:5432/postgres')

with engine.connect() as conn:
    # Get all tables
    result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
    tables = [row[0] for row in result]
    print('Tables in Supabase:', tables)
    
    # Check if any data exists
    for table in tables:
        if table != 'alembic_version':
            try:
                count_result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = count_result.scalar()
                print(f'Table {table}: {count} rows')
            except Exception as e:
                print(f'Error checking {table}: {e}')
