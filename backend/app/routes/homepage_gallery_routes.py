import os
import uuid
import shutil
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pymongo import ReturnDocument

from ..core.database import get_db, get_next_sequence
from ..core.security import require_role, DotDict
from ..schemas.homepage_gallery_schema import (
    HomepageGalleryImageCreate, HomepageGalleryImageUpdate, GalleryReorder
)
from ..routes.country_routes import save_country_image
from ..core.config import settings
from ..services.activity_service import log_activity

# ─── Routers ────────────────────────────────────────────────────────────────
public_router = APIRouter(prefix="/api/public/gallery", tags=["Homepage Gallery - Public"])
admin_router  = APIRouter(prefix="/admin/gallery",      tags=["Homepage Gallery - Admin"])

# ─── Auth dependency ─────────────────────────────────────────────────────────
get_current_admin = require_role(["MASTER_ADMIN", "LEAD_MANAGER"])


# ─── Helpers ─────────────────────────────────────────────────────────────────
def fmt_gallery_image(img: dict) -> dict:
    created = img.get("created_at")
    created_str = created.isoformat() if hasattr(created, "isoformat") else str(created) if created else None
    return {
        "id": img.get("id"),
        "image_path": img.get("image_path"),
        "title": img.get("title"),
        "display_order": img.get("display_order", 0),
        "is_active": img.get("is_active", True),
        "created_at": created_str,
    }


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@public_router.get("")
def get_public_gallery(db = Depends(get_db)):
    """Return all active gallery images ordered by display_order."""
    images = list(
        db.homepage_gallery_images.find({"is_active": {"$ne": False}}, {"_id": 0})
        .sort([("display_order", 1), ("id", 1)])
    )
    return [fmt_gallery_image(img) for img in images]


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — GALLERY CRUD
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("")
def list_gallery_images(db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    images = list(
        db.homepage_gallery_images.find({}, {"_id": 0})
        .sort([("display_order", 1), ("id", 1)])
    )
    return [fmt_gallery_image(img) for img in images]


@admin_router.post("")
def create_gallery_image(
    payload: HomepageGalleryImageCreate,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    img_id = get_next_sequence("homepage_gallery_images")
    img_data = {
        "id": img_id,
        **payload.model_dump(),
        "created_at": datetime.now(timezone.utc)
    }
    db.homepage_gallery_images.insert_one(img_data)
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Gallery Updates",
        metadata={"action": "create", "image_id": img_id, "title": img_data.get("title")}
    )
    
    return fmt_gallery_image(img_data)


# NOTE: /reorder and /upload must be before /{id}
@admin_router.post("/reorder")
def reorder_gallery_images(
    payload: GalleryReorder,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    for order, img_id in enumerate(payload.ordered_ids):
        db.homepage_gallery_images.update_one({"id": img_id}, {"$set": {"display_order": order}})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Gallery Updates",
        metadata={"action": "reorder", "ordered_ids": payload.ordered_ids}
    )
    
    return {"success": True}


@admin_router.post("/upload")
async def upload_gallery_image(
    file: UploadFile = File(...),
    admin: DotDict = Depends(get_current_admin)
):
    """Upload an image to gallery subfolder and return its URL."""
    path = save_country_image(file, "gallery")
    return {"success": True, "path": path}


@admin_router.put("/{image_id}")
def update_gallery_image(
    image_id: int,
    payload: HomepageGalleryImageUpdate,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    img = db.homepage_gallery_images.find_one({"id": image_id})
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found.")

    update_data = payload.model_dump(exclude_unset=True)
    updated = db.homepage_gallery_images.find_one_and_update(
        {"id": image_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Gallery Updates",
        metadata={"action": "update", "image_id": image_id, "title": updated.get("title")}
    )
    
    return fmt_gallery_image(updated)


@admin_router.delete("/{image_id}")
def delete_gallery_image(
    image_id: int,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    img = db.homepage_gallery_images.find_one({"id": image_id})
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found.")

    title = img.get("title")
    db.homepage_gallery_images.delete_one({"id": image_id})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Gallery Updates",
        metadata={"action": "delete", "image_id": image_id, "title": title}
    )
    
    return {"success": True, "id": image_id}


@admin_router.patch("/{image_id}/toggle")
def toggle_gallery_image(
    image_id: int,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    img = db.homepage_gallery_images.find_one({"id": image_id})
    if not img:
        raise HTTPException(status_code=404, detail="Gallery image not found.")

    new_active = not img.get("is_active", True)
    db.homepage_gallery_images.update_one({"id": image_id}, {"$set": {"is_active": new_active}})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Gallery Updates",
        metadata={"action": "toggle", "image_id": image_id, "is_active": new_active, "title": img.get("title")}
    )
    
    return {"success": True, "id": image_id, "is_active": new_active}
