from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .core.security import get_password_hash
from .models.admin import Admin
from .models import country as _country_models  # noqa: F401 — ensures tables are created
from .models import homepage_gallery as _homepage_gallery_models  # noqa: F401
from .routes import auth_routes, student_routes, dashboard_routes, contact_routes
from .routes.country_routes import public_router as country_public_router, admin_router as country_admin_router
from .routes.homepage_gallery_routes import public_router as gallery_public_router, admin_router as gallery_admin_router

# Create DB tables automatically on startup
Base.metadata.create_all(bind=engine)

# Auto-seed admin user if DB is blank
db = SessionLocal()
try:
    admin_exists = db.query(Admin).filter(Admin.username == "admin").first()
    if not admin_exists:
        default_admin = Admin(
            username="admin",
            password_hash=get_password_hash("admin123"),
            full_name="SVET Admin"
        )
        db.add(default_admin)
        db.commit()
        print("[Database] Successfully seeded default admin credentials ('admin' / 'admin123').")
finally:
    db.close()

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Sri Venkateshwara Educational Trust CRM and Lead management portal backend.",
    version="1.0.0"
)

# Configure CORS Middleware
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
        "api_version": "1.0.0"
    }
