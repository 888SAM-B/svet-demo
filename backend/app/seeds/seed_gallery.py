"""
SVET Homepage Gallery Seed Script
=================================
Run from the backend/ directory:
    python -m app.seeds.seed_gallery

Or from the project root (svet-demo/):
    python -m backend.app.seeds.seed_gallery
"""

import sys
import os

# Allow running as a module from the backend/ directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine, Base
from app.models import homepage_gallery as _homepage_gallery_models  # noqa — ensure tables exist
from app.models.homepage_gallery import HomepageGalleryImage

# ── Auto-create tables if missing ─────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

DEFAULT_IMAGES = [
    {
        "image_path": "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
        "title": "Medical Research Lab",
        "display_order": 0,
        "is_active": True
    },
    {
        "image_path": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
        "title": "Professional Medical Faculty",
        "display_order": 1,
        "is_active": True
    },
    {
        "image_path": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        "title": "Modern Healthcare Infrastructure",
        "display_order": 2,
        "is_active": True
    },
    {
        "image_path": "https://images.unsplash.com/photo-1584515901387-a7f180f223b3?auto=format&fit=crop&w=800&q=80",
        "title": "Practical Clinical Training",
        "display_order": 3,
        "is_active": True
    },
    {
        "image_path": "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80",
        "title": "Interactive Medical Lectures",
        "display_order": 4,
        "is_active": True
    },
    {
        "image_path": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
        "title": "Global Stethoscope & Diagnosis",
        "display_order": 5,
        "is_active": True
    }
]


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        count = db.query(HomepageGalleryImage).count()
        if count > 0:
            print(f"[Seed] Homepage gallery already has {count} images. Skipping seed.")
            return

        for item in DEFAULT_IMAGES:
            img = HomepageGalleryImage(**item)
            db.add(img)
            print(f"[Seed] Adding image: {item['title']}")

        db.commit()
        print("[Seed] SUCCESS: Homepage gallery seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] ERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
