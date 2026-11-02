import os
import uuid
import shutil
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import HTTPBearer
from pymongo import ReturnDocument

from ..core.database import get_db, get_next_sequence
from ..core.security import require_role, DotDict
from ..schemas.country_schema import (
    CountryCreate, CountryUpdate,
    CountrySectionCreate, CountrySectionUpdate,
    CountrySEOCreate, CountryReorder, SectionReorder
)
from ..core.config import settings
from ..services.activity_service import log_activity

# ─── Routers ────────────────────────────────────────────────────────────────
public_router = APIRouter(prefix="/api/public/countries", tags=["Countries - Public"])
admin_router  = APIRouter(prefix="/admin/countries",      tags=["Countries - Admin"])

security_scheme = HTTPBearer()

ALLOWED_SUBFOLDER = {"flags", "cards", "heroes", "gallery", "universities"}
ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


get_current_admin = require_role(["MASTER_ADMIN", "COUNTRY_MANAGER"])


# ─── Helpers ─────────────────────────────────────────────────────────────────
def fmt_country(c: dict) -> dict:
    created = c.get("created_at")
    created_str = created.isoformat() if hasattr(created, "isoformat") else str(created) if created else None
    fee = c.get("starting_fee")
    return {
        "id": c.get("id"),
        "name": c.get("name"),
        "slug": c.get("slug"),
        "flag_image": c.get("flag_image"),
        "card_image": c.get("card_image"),
        "short_description": c.get("short_description"),
        "starting_fee": float(fee) if fee is not None else None,
        "display_order": c.get("display_order", 0),
        "is_active": c.get("is_active", True),
        "created_at": created_str,
    }


def fmt_section(s: dict) -> dict:
    created = s.get("created_at")
    created_str = created.isoformat() if hasattr(created, "isoformat") else str(created) if created else None
    return {
        "id": s.get("id"),
        "country_id": s.get("country_id"),
        "section_type": s.get("section_type"),
        "section_title": s.get("section_title"),
        "section_order": s.get("section_order", 0),
        "content_json": s.get("content_json"),
        "is_active": s.get("is_active", True),
        "created_at": created_str,
    }


def fmt_seo(seo: dict) -> dict:
    if not seo:
        return {}
    return {
        "id": seo.get("id"),
        "country_id": seo.get("country_id"),
        "meta_title": seo.get("meta_title"),
        "meta_description": seo.get("meta_description"),
        "keywords": seo.get("keywords"),
        "og_image": seo.get("og_image"),
    }


def save_country_image(file: UploadFile, sub_folder: str) -> str:
    """Save image and return relative URL path."""
    if sub_folder not in ALLOWED_SUBFOLDER:
        raise HTTPException(status_code=400, detail=f"Invalid sub_folder. Use one of: {ALLOWED_SUBFOLDER}")

    filename = file.filename or "unknown"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed.")

    # Size check
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 5MB limit.")

    unique_name = f"{uuid.uuid4().hex[:10]}.{ext}"
    dest_dir = os.path.join(settings.UPLOAD_DIR, "countries", sub_folder)
    os.makedirs(dest_dir, exist_ok=True)

    # Path traversal guard
    real_dest = os.path.realpath(dest_dir)
    real_base = os.path.realpath(settings.UPLOAD_DIR)
    if not real_dest.startswith(real_base):
        raise HTTPException(status_code=400, detail="Path traversal detected.")

    dest_path = os.path.join(dest_dir, unique_name)
    with open(dest_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    return f"/uploads/countries/{sub_folder}/{unique_name}"


# ══════════════════════════════════════════════════════════════════════════════
# PUBLIC ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@public_router.get("")
def get_public_countries(db = Depends(get_db)):
    """Return all active countries ordered by display_order."""
    countries = list(
        db.countries.find({"is_active": {"$ne": False}}, {"_id": 0})
        .sort([("display_order", 1), ("id", 1)])
    )
    return [fmt_country(c) for c in countries]


@public_router.get("/{slug}")
def get_public_country(slug: str, db = Depends(get_db)):
    """Return country + active sections + SEO for the modal."""
    country = db.countries.find_one({"slug": slug, "is_active": {"$ne": False}}, {"_id": 0})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")

    sections = list(
        db.country_page_sections.find(
            {"country_id": country["id"], "is_active": {"$ne": False}},
            {"_id": 0}
        ).sort("section_order", 1)
    )
    seo = db.country_seo.find_one({"country_id": country["id"]}, {"_id": 0})

    return {
        "country": fmt_country(country),
        "sections": [fmt_section(s) for s in sections],
        "seo": fmt_seo(seo)
    }


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — COUNTRIES CRUD
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("")
def list_countries(db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    countries = list(
        db.countries.find({}, {"_id": 0})
        .sort([("display_order", 1), ("id", 1)])
    )
    return [fmt_country(c) for c in countries]


@admin_router.post("")
def create_country(payload: CountryCreate, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    # Duplicate check
    if db.countries.find_one({"name": payload.name}):
        raise HTTPException(status_code=400, detail="Country name already exists.")
    if db.countries.find_one({"slug": payload.slug}):
        raise HTTPException(status_code=400, detail="Slug already exists.")

    country_id = get_next_sequence("countries")
    now = datetime.now(timezone.utc)
    country_data = {
        "id": country_id,
        **payload.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    db.countries.insert_one(country_data)
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "create", "country_name": country_data.get("name")}
    )
    
    return fmt_country(country_data)


# NOTE: /reorder and /upload MUST be declared before /{id} to avoid path conflicts
@admin_router.post("/reorder")
def reorder_countries(payload: CountryReorder, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    for order, country_id in enumerate(payload.ordered_ids):
        db.countries.update_one({"id": country_id}, {"$set": {"display_order": order}})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "reorder", "ordered_ids": payload.ordered_ids}
    )
    
    return {"success": True}


@admin_router.post("/upload")
async def upload_country_image(
    file: UploadFile = File(...),
    sub_folder: str = Form(...),
    admin: DotDict = Depends(get_current_admin)
):
    path = save_country_image(file, sub_folder)
    return {"success": True, "path": path}


@admin_router.put("/{country_id}")
def update_country(country_id: int, payload: CountryUpdate, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    country = db.countries.find_one({"id": country_id})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")

    # Duplicate slug check (exclude self)
    if payload.slug and payload.slug != country.get("slug"):
        if db.countries.find_one({"slug": payload.slug, "id": {"$ne": country_id}}):
            raise HTTPException(status_code=400, detail="Slug already in use.")
    if payload.name and payload.name != country.get("name"):
        if db.countries.find_one({"name": payload.name, "id": {"$ne": country_id}}):
            raise HTTPException(status_code=400, detail="Country name already in use.")

    update_data = payload.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)

    updated = db.countries.find_one_and_update(
        {"id": country_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "update", "country_id": country_id, "country_name": updated.get("name")}
    )
    
    return fmt_country(updated)


@admin_router.delete("/{country_id}")
def delete_country(country_id: int, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    country = db.countries.find_one({"id": country_id})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
    country_name = country.get("name")
    
    # Cascade delete country, its sections, and its SEO
    db.countries.delete_one({"id": country_id})
    db.country_page_sections.delete_many({"country_id": country_id})
    db.country_seo.delete_one({"country_id": country_id})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "delete", "country_id": country_id, "country_name": country_name}
    )
    
    return {"success": True, "id": country_id}


@admin_router.patch("/{country_id}/toggle")
def toggle_country(country_id: int, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    country = db.countries.find_one({"id": country_id})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
        
    new_active = not country.get("is_active", True)
    db.countries.update_one({"id": country_id}, {"$set": {"is_active": new_active, "updated_at": datetime.now(timezone.utc)}})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "toggle", "country_id": country_id, "is_active": new_active, "country_name": country.get("name")}
    )
    
    return {"success": True, "id": country_id, "is_active": new_active}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — SECTIONS CRUD
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("/{country_id}/sections")
def list_sections(country_id: int, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    sections = list(
        db.country_page_sections.find({"country_id": country_id}, {"_id": 0})
        .sort("section_order", 1)
    )
    return [fmt_section(s) for s in sections]


@admin_router.post("/{country_id}/sections")
def create_section(country_id: int, payload: CountrySectionCreate, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    country = db.countries.find_one({"id": country_id})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
        
    section_id = get_next_sequence("country_page_sections")
    section_data = {
        "id": section_id,
        "country_id": country_id,
        **payload.model_dump(),
        "created_at": datetime.now(timezone.utc)
    }
    db.country_page_sections.insert_one(section_data)
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "create_section", "country_id": country_id, "section_type": section_data.get("section_type")}
    )
    
    return fmt_section(section_data)


# /sections/reorder BEFORE /sections/{sid}
@admin_router.post("/{country_id}/sections/reorder")
def reorder_sections(country_id: int, payload: SectionReorder, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    for order, section_id in enumerate(payload.ordered_ids):
        db.country_page_sections.update_one(
            {"id": section_id, "country_id": country_id},
            {"$set": {"section_order": order}}
        )
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "reorder_sections", "country_id": country_id, "ordered_ids": payload.ordered_ids}
    )
    
    return {"success": True}


@admin_router.put("/{country_id}/sections/{section_id}")
def update_section(country_id: int, section_id: int, payload: CountrySectionUpdate, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    section = db.country_page_sections.find_one({"id": section_id, "country_id": country_id})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
        
    update_data = payload.model_dump(exclude_unset=True)
    updated = db.country_page_sections.find_one_and_update(
        {"id": section_id, "country_id": country_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "update_section", "country_id": country_id, "section_id": section_id, "section_type": updated.get("section_type")}
    )
    
    return fmt_section(updated)


@admin_router.delete("/{country_id}/sections/{section_id}")
def delete_section(country_id: int, section_id: int, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    section = db.country_page_sections.find_one({"id": section_id, "country_id": country_id})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
    section_type = section.get("section_type")
    
    db.country_page_sections.delete_one({"id": section_id, "country_id": country_id})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "delete_section", "country_id": country_id, "section_id": section_id, "section_type": section_type}
    )
    
    return {"success": True, "id": section_id}


@admin_router.patch("/{country_id}/sections/{section_id}/toggle")
def toggle_section(country_id: int, section_id: int, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    section = db.country_page_sections.find_one({"id": section_id, "country_id": country_id})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
        
    new_active = not section.get("is_active", True)
    db.country_page_sections.update_one(
        {"id": section_id, "country_id": country_id},
        {"$set": {"is_active": new_active}}
    )
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "toggle_section", "country_id": country_id, "section_id": section_id, "is_active": new_active, "section_type": section.get("section_type")}
    )
    
    return {"success": True, "id": section_id, "is_active": new_active}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — SEO
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("/{country_id}/seo")
def get_seo(country_id: int, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    seo = db.country_seo.find_one({"country_id": country_id}, {"_id": 0})
    if not seo:
        return {}
    return fmt_seo(seo)


@admin_router.post("/{country_id}/seo")
def upsert_seo(country_id: int, payload: CountrySEOCreate, db = Depends(get_db), admin: DotDict = Depends(get_current_admin)):
    country = db.countries.find_one({"id": country_id})
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
        
    existing = db.country_seo.find_one({"country_id": country_id})
    if existing:
        updated = db.country_seo.find_one_and_update(
            {"country_id": country_id},
            {"$set": payload.model_dump(exclude_unset=True)},
            return_document=ReturnDocument.AFTER
        )
        res_data = updated
    else:
        seo_id = get_next_sequence("country_seo")
        seo_data = {
            "id": seo_id,
            "country_id": country_id,
            **payload.model_dump()
        }
        db.country_seo.insert_one(seo_data)
        res_data = seo_data
        
    log_activity(
        db=db,
        user_id=admin.id,
        action="Country Updates",
        metadata={"action": "upsert_seo", "country_id": country_id}
    )
    
    return fmt_seo(res_data)
