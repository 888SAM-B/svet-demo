from pymongo import MongoClient, ASCENDING, DESCENDING, ReturnDocument
from .config import settings

# Initialize PyMongo Client with connection pooling
client = MongoClient(
    settings.MONGODB_URL,
    maxPoolSize=50,
    minPoolSize=5,
    serverSelectionTimeoutMS=5000
)

# Active Database
db = client[settings.MONGODB_DB_NAME]

def get_db():
    """
    FastAPI dependency yielding the active MongoDB database instance.
    """
    yield db

def get_next_sequence(name: str) -> int:
    """
    Atomically generates sequential integer IDs (1, 2, 3...)
    for collections to preserve seamless compatibility with frontend IDs.
    """
    seq_doc = db.counters.find_one_and_update(
        {"_id": name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    return int(seq_doc["seq"])

def init_db_indexes():
    """
    Create necessary indexes for performance and unique constraints.
    """
    try:
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.users.create_index([("id", ASCENDING)], unique=True)
        db.students.create_index([("application_id", ASCENDING)], unique=True)
        db.students.create_index([("id", ASCENDING)], unique=True)
        db.students.create_index([("status", ASCENDING)])
        db.students.create_index([("preferred_country", ASCENDING)])
        db.students.create_index([("created_at", DESCENDING)])
        db.countries.create_index([("slug", ASCENDING)], unique=True)
        db.countries.create_index([("id", ASCENDING)], unique=True)
        db.countries.create_index([("display_order", ASCENDING)])
        db.country_page_sections.create_index([("country_id", ASCENDING), ("section_order", ASCENDING)])
        db.country_page_sections.create_index([("id", ASCENDING)], unique=True)
        db.country_seo.create_index([("country_id", ASCENDING)], unique=True)
        db.homepage_gallery_images.create_index([("display_order", ASCENDING)])
        db.homepage_gallery_images.create_index([("id", ASCENDING)], unique=True)
        db.activity_logs.create_index([("timestamp", DESCENDING)])
        print(f"[MongoDB] Successfully verified and initialized indexes on '{settings.MONGODB_DB_NAME}'.")
    except Exception as e:
        print(f"[MongoDB] Warning: Could not initialize all indexes: {e}")
