import pymysql
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Auto-create database if not exists
try:
    conn = pymysql.connect(
        host=settings.DB_HOST,
        port=int(settings.DB_PORT),
        user=settings.DB_USER,
        password=settings.DB_PASS
    )
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.commit()
    conn.close()
    print(f"[Database] Successfully verified/created database: {settings.DB_NAME}")
except Exception as e:
    print(f"[Database] Warning: Failed to automatically check/create database: {e}")

# Create database engine with connection pooling enabled
engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True,  # checks connection liveliness
    pool_recycle=3600    # recycle connection after 1 hour
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
