"""
MySQL to MongoDB Migration Script for SVET CRM
================================================
This script extracts all data from MySQL (svet_db) and migrates it
into MongoDB (svet_db), ensuring data types, nested structures,
indexes, and auto-increment sequences are properly preserved.

Usage:
    python backend/migrate_to_mongo.py
"""

import os
import sys
import json
from datetime import datetime, date
from decimal import Decimal
import pymysql
from pymongo import MongoClient, ASCENDING, DESCENDING

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from app.core.config import settings

def clean_val(v):
    """Normalize MySQL values for BSON serialization"""
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, (datetime, date)):
        if isinstance(v, date) and not isinstance(v, datetime):
            return datetime.combine(v, datetime.min.time())
        return v
    if isinstance(v, (bytes, bytearray)):
        return v.decode('utf-8', errors='ignore')
    return v

def clean_dict(d):
    """Recursively clean dict fields"""
    cleaned = {}
    for k, v in d.items():
        if k == "is_active" and v is not None:
            cleaned[k] = bool(v)
        else:
            cleaned[k] = clean_val(v)
    return cleaned

def migrate():
    print("=" * 60)
    print("Starting MySQL to MongoDB Migration for SVET CRM")
    print("=" * 60)

    # 1. Connect to MySQL
    print(f"[MySQL] Connecting to {settings.DB_HOST}:{settings.DB_PORT} ({settings.DB_NAME})...")
    mysql_conn = pymysql.connect(
        host=settings.DB_HOST,
        port=int(settings.DB_PORT),
        user=settings.DB_USER,
        password=settings.DB_PASS,
        database=settings.DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
    print("[MySQL] Connected successfully!")

    # 2. Connect to MongoDB
    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    mongo_db_name = os.getenv("MONGODB_DB_NAME", "svet_db")
    print(f"[MongoDB] Connecting to {mongo_url} ({mongo_db_name})...")
    mongo_client = MongoClient(mongo_url)
    mongo_db = mongo_client[mongo_db_name]
    print("[MongoDB] Connected successfully!")

    # 3. Setup Indexes
    print("[MongoDB] Setting up collection indexes...")
    mongo_db.users.create_index([("email", ASCENDING)], unique=True)
    mongo_db.users.create_index([("id", ASCENDING)], unique=True)
    mongo_db.students.create_index([("application_id", ASCENDING)], unique=True)
    mongo_db.students.create_index([("id", ASCENDING)], unique=True)
    mongo_db.countries.create_index([("slug", ASCENDING)], unique=True)
    mongo_db.countries.create_index([("id", ASCENDING)], unique=True)
    mongo_db.country_page_sections.create_index([("country_id", ASCENDING), ("section_order", ASCENDING)])
    mongo_db.country_page_sections.create_index([("id", ASCENDING)], unique=True)
    mongo_db.country_seo.create_index([("country_id", ASCENDING)], unique=True)
    mongo_db.homepage_gallery_images.create_index([("display_order", ASCENDING)])
    mongo_db.homepage_gallery_images.create_index([("id", ASCENDING)], unique=True)
    mongo_db.activity_logs.create_index([("timestamp", DESCENDING)])

    # Helper cursor
    cursor = mysql_conn.cursor()

    # Track max IDs for counters
    counters = {}

    # Tables to migrate
    # -----------------
    # A. Users
    cursor.execute("SELECT * FROM users ORDER BY id ASC")
    users = cursor.fetchall()
    if users:
        mongo_db.users.delete_many({})
        for u in users:
            u_clean = clean_dict(u)
            mongo_db.users.insert_one(u_clean)
        counters["users"] = max(u["id"] for u in users)
        print(f"  -> Migrated {len(users)} users")

    # B. Admins (legacy table if needed)
    cursor.execute("SELECT * FROM admins ORDER BY id ASC")
    admins = cursor.fetchall()
    if admins:
        mongo_db.admins.delete_many({})
        for a in admins:
            mongo_db.admins.insert_one(clean_dict(a))
        counters["admins"] = max(a["id"] for a in admins)
        print(f"  -> Migrated {len(admins)} admins")

    # C. Student Documents
    cursor.execute("SELECT * FROM student_documents ORDER BY id ASC")
    student_docs = cursor.fetchall()
    docs_by_student_id = {}
    if student_docs:
        mongo_db.student_documents.delete_many({})
        for sd in student_docs:
            sd_clean = clean_dict(sd)
            mongo_db.student_documents.insert_one(sd_clean)
            st_id = sd["student_id"]
            if st_id not in docs_by_student_id:
                docs_by_student_id[st_id] = []
            docs_by_student_id[st_id].append(sd_clean)
        counters["student_documents"] = max(sd["id"] for sd in student_docs)
        print(f"  -> Migrated {len(student_docs)} student documents")

    # D. Students (embed documents list directly inside student document as well)
    cursor.execute("SELECT * FROM students ORDER BY id ASC")
    students = cursor.fetchall()
    if students:
        mongo_db.students.delete_many({})
        for s in students:
            s_clean = clean_dict(s)
            s_id = s["id"]
            s_clean["documents"] = docs_by_student_id.get(s_id, [])
            mongo_db.students.insert_one(s_clean)
        counters["students"] = max(s["id"] for s in students)
        print(f"  -> Migrated {len(students)} students (with embedded documents)")

    # E. Contact Enquiries
    cursor.execute("SELECT * FROM contact_enquiries ORDER BY id ASC")
    enquiries = cursor.fetchall()
    if enquiries:
        mongo_db.contact_enquiries.delete_many({})
        for ce in enquiries:
            mongo_db.contact_enquiries.insert_one(clean_dict(ce))
        counters["contact_enquiries"] = max(ce["id"] for ce in enquiries)
        print(f"  -> Migrated {len(enquiries)} contact enquiries")
    else:
        counters["contact_enquiries"] = 0
        print("  -> Migrated 0 contact enquiries (empty table)")

    # F. Countries
    cursor.execute("SELECT * FROM countries ORDER BY id ASC")
    countries = cursor.fetchall()
    if countries:
        mongo_db.countries.delete_many({})
        for c in countries:
            mongo_db.countries.insert_one(clean_dict(c))
        counters["countries"] = max(c["id"] for c in countries)
        print(f"  -> Migrated {len(countries)} countries")

    # G. Country Page Sections
    cursor.execute("SELECT * FROM country_page_sections ORDER BY id ASC")
    sections = cursor.fetchall()
    if sections:
        mongo_db.country_page_sections.delete_many({})
        for sec in sections:
            sec_clean = clean_dict(sec)
            # Ensure content_json is decoded if stored as string
            if isinstance(sec_clean.get("content_json"), str):
                try:
                    sec_clean["content_json"] = json.loads(sec_clean["content_json"])
                except Exception:
                    pass
            mongo_db.country_page_sections.insert_one(sec_clean)
        counters["country_page_sections"] = max(sec["id"] for sec in sections)
        print(f"  -> Migrated {len(sections)} country page sections")

    # H. Country SEO
    cursor.execute("SELECT * FROM country_seo ORDER BY id ASC")
    seos = cursor.fetchall()
    if seos:
        mongo_db.country_seo.delete_many({})
        for seo in seos:
            mongo_db.country_seo.insert_one(clean_dict(seo))
        counters["country_seo"] = max(seo["id"] for seo in seos)
        print(f"  -> Migrated {len(seos)} country seo records")

    # I. Homepage Gallery Images
    cursor.execute("SELECT * FROM homepage_gallery_images ORDER BY id ASC")
    gallery = cursor.fetchall()
    if gallery:
        mongo_db.homepage_gallery_images.delete_many({})
        for img in gallery:
            mongo_db.homepage_gallery_images.insert_one(clean_dict(img))
        counters["homepage_gallery_images"] = max(img["id"] for img in gallery)
        print(f"  -> Migrated {len(gallery)} homepage gallery images")

    # J. Activity Logs
    cursor.execute("SELECT * FROM activity_logs ORDER BY id ASC")
    logs = cursor.fetchall()
    if logs:
        mongo_db.activity_logs.delete_many({})
        for log in logs:
            log_clean = clean_dict(log)
            if isinstance(log_clean.get("metadata_json"), str):
                try:
                    log_clean["metadata_json"] = json.loads(log_clean["metadata_json"])
                except Exception:
                    pass
            mongo_db.activity_logs.insert_one(log_clean)
        counters["activity_logs"] = max(log["id"] for log in logs)
        print(f"  -> Migrated {len(logs)} activity logs")

    # 4. Save sequence counters
    print("[MongoDB] Initializing sequence counters...")
    mongo_db.counters.delete_many({})
    for coll_name, max_id in counters.items():
        mongo_db.counters.insert_one({"_id": coll_name, "seq": max_id})
        print(f"  Counter '{coll_name}': next starts at {max_id + 1}")

    mysql_conn.close()
    mongo_client.close()

    print("=" * 60)
    print("SUCCESS: MySQL to MongoDB Migration Completed Successfully!")
    print("=" * 60)

if __name__ == "__main__":
    migrate()
