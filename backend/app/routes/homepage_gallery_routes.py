import os
import uuid
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models.admin import Admin
from ..models.homepage_gallery import HomepageGalleryImage
from ..schemas.homepage_gallery_schema import (
    HomepageGalleryImageCreate, HomepageGalleryImageUpdate, GalleryReorder
)
from ..routes.country_routes import get_current_admin, save_country_image
from ..core.config import settings

# ─── Routers ────────────────────────────────────────────────────────────────
public_router = APIRouter(prefix="/api/public/gallery", tags=["Homepage Gallery - Public"])
admin_router  = APIRouter(prefix="/admin/gallery",      tags=["Homepage Gallery - Admin"])


# ─── Helpers ─────────────────────────────────────────────────────────────────
def fmt_gallery_image(img: HomepageGalleryImage) -> dict:
    return {
        "id": img.id,
        "image_path": img.image_path,
        "title": img.title,
        "display_order": img.display_order,
        "is_active": img.is_active,
        "created_at": img.created_at.isoformat() if img.created_at else None,
    }


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@public_router.get("")
def get_public_gallery(db: Session = Depends(get_db)):
    """Return all active gallery images ordered by display_order."""
    images = (
        db.query(HomepageGalleryImage)
        .filter(HomepageGalleryImage.is_active == True)
        .order_by(HomepageGalleryImage.display_order, HomepageGalleryImage.id)
        .all()
    )
    return [fmt_gallery_image(img) for img in images]


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — GALLERY CRUD
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("")
def list_gallery_images(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    images = db.query(HomepageGalleryImage).order_by(HomepageGalleryImage.display_order, HomepageGalleryImage.id).all()
    return [fmt_gallery_image(img) for img in images]


@admin_router.post("")
def create_gallery_image(
    payload: HomepageGalleryImageCreate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    img = HomepageGalleryImage(**payload.model_dump())
    db.add(img)
    db.commit()
    db.refresh(img)
    return fmt_gallery_image(img)


# NOTE: /reorder and /upload must be before /{id}
@admin_router.post("/reorder")
def reorder_gallery_images(
    payload: GalleryReorder,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    for order, img_id in enumerate(payload.ordered_ids):
        db.query(HomepageGalleryImage).filter(HomepageGalleryImage.id == img_id).update({"display_order": order})
    db.commit()
    return {"message": "Gallery images reordered successfully."}


@admin_router.post("/upload")
def upload_gallery_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin)
):
    """Upload gallery image file and return relative path."""
    path = save_country_image(file, "gallery")
    return {"image_path": path}


@admin_router.put("/{image_id}")
def update_gallery_image(
    image_id: int,
    payload: HomepageGalleryImageUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    img = db.query(HomepageGalleryImage).filter(HomepageGalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found.")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(img, k, v)

    db.commit()
    db.refresh(img)
    return fmt_gallery_image(img)


@admin_router.delete("/{image_id}")
def delete_gallery_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    img = db.query(HomepageGalleryImage).filter(HomepageGalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found.")

    # Try to delete file from disk if it starts with /uploads
    if img.image_path and img.image_path.startswith("/uploads"):
        rel_path = img.image_path.lstrip("/")
        abs_path = os.path.join(settings.UPLOAD_DIR, "..", rel_path)
        if os.path.exists(abs_path):
            try:
                os.remove(abs_path)
            except Exception as e:
                print(f"[Gallery] Failed to remove file from disk: {e}")

    db.delete(img)
    db.commit()
    return {"message": "Gallery image deleted successfully."}


@admin_router.patch("/{image_id}/toggle")
def toggle_gallery_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    img = db.query(HomepageGalleryImage).filter(HomepageGalleryImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found.")

    img.is_active = not img.is_active
    db.commit()
    db.refresh(img)
    return fmt_gallery_image(img)
