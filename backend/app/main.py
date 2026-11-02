import os
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.database import db, init_db_indexes, get_next_sequence
from .core.security import get_password_hash
from .routes import auth_routes, student_routes, dashboard_routes, contact_routes, user_routes, admin_stats_routes
from .routes.country_routes import public_router as country_public_router, admin_router as country_admin_router
from .routes.homepage_gallery_routes import public_router as gallery_public_router, admin_router as gallery_admin_router

# Initialize MongoDB collection indexes on startup
init_db_indexes()

# Auto-seed admin user if DB is blank
try:
    admin_exists = db.users.find_one({"email": "admin@svet.com"})
    if not admin_exists:
        admin_id = get_next_sequence("users")
        now = datetime.now(timezone.utc)
        default_admin = {
            "id": admin_id,
            "name": "Master Admin",
            "email": "admin@svet.com",
            "password_hash": get_password_hash("admin123"),
            "role": "MASTER_ADMIN",
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        db.users.insert_one(default_admin)
        print("[Database] Successfully seeded default master admin credentials ('admin@svet.com' / 'admin123').")
except Exception as e:
    print(f"[Database] Warning: Could not verify default admin user: {e}")

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Sri Venkateshwara Educational Trust CRM and Lead management portal backend (MongoDB Powered).",
    version="1.0.0"
)

# Configure CORS Middleware
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000"
]

cors_env = os.getenv("CORS_ORIGINS", "")
if cors_env:
    origins.extend([o.strip() for o in cors_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registrations
app.include_router(auth_routes.router, prefix=settings.API_V1_STR)
app.include_router(student_routes.router, prefix=settings.API_V1_STR)
app.include_router(student_routes.files_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_routes.export_router, prefix=settings.API_V1_STR)
app.include_router(contact_routes.router, prefix=settings.API_V1_STR)
app.include_router(user_routes.router, prefix=settings.API_V1_STR)
app.include_router(admin_stats_routes.router, prefix=settings.API_V1_STR)

# Country CMS — public routes have their own full prefix, admin routes use API_V1_STR
app.include_router(country_public_router)
app.include_router(country_admin_router, prefix=settings.API_V1_STR)
app.include_router(gallery_public_router)
app.include_router(gallery_admin_router, prefix=settings.API_V1_STR)

# Serve uploaded files publicly (country images); student files remain JWT-protected
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Health Check Endpoint
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    """Verify backend system status and accessibility"""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "MongoDB",
        "api_version": "1.0.0"
    }
