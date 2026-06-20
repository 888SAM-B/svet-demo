import os
import uuid
import shutil
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.security import decode_access_token
from ..models.admin import Admin
from ..models.country import Country, CountryPageSection, CountrySEO
from ..schemas.country_schema import (
    CountryCreate, CountryUpdate,
    CountrySectionCreate, CountrySectionUpdate,
    CountrySEOCreate, CountryReorder, SectionReorder
)
from ..core.config import settings

# ─── Routers ────────────────────────────────────────────────────────────────
public_router = APIRouter(prefix="/api/public/countries", tags=["Countries - Public"])
admin_router  = APIRouter(prefix="/admin/countries",      tags=["Countries - Admin"])

security_scheme = HTTPBearer()

ALLOWED_SUBFOLDER = {"flags", "cards", "heroes", "gallery", "universities"}
ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


# ─── Auth dependency ─────────────────────────────────────────────────────────
def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Admin:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token.")
    username = payload.get("sub")
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found.")
    return admin


# ─── Helpers ─────────────────────────────────────────────────────────────────
def fmt_country(c: Country) -> dict:
    return {
        "id": c.id,
        "name": c.name,
        "slug": c.slug,
        "flag_image": c.flag_image,
        "card_image": c.card_image,
        "short_description": c.short_description,
        "starting_fee": float(c.starting_fee) if c.starting_fee else None,
        "display_order": c.display_order,
        "is_active": c.is_active,
        "created_at": c.created_at.isoformat() if c.created_at else None,
    }


def fmt_section(s: CountryPageSection) -> dict:
    return {
        "id": s.id,
        "country_id": s.country_id,
        "section_type": s.section_type,
        "section_title": s.section_title,
        "section_order": s.section_order,
        "content_json": s.content_json,
        "is_active": s.is_active,
        "created_at": s.created_at.isoformat() if s.created_at else None,
    }


def fmt_seo(seo: CountrySEO) -> dict:
    return {
        "id": seo.id,
        "country_id": seo.country_id,
        "meta_title": seo.meta_title,
        "meta_description": seo.meta_description,
        "keywords": seo.keywords,
        "og_image": seo.og_image,
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
def get_public_countries(db: Session = Depends(get_db)):
    """Return all active countries ordered by display_order."""
    countries = (
        db.query(Country)
        .filter(Country.is_active == True)
        .order_by(Country.display_order, Country.id)
        .all()
    )
    return [fmt_country(c) for c in countries]


@public_router.get("/{slug}")
def get_public_country(slug: str, db: Session = Depends(get_db)):
    """Return country + active sections + SEO for the modal."""
    country = db.query(Country).filter(Country.slug == slug, Country.is_active == True).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")

    sections = [fmt_section(s) for s in country.sections if s.is_active]
    seo = fmt_seo(country.seo) if country.seo else {}

    return {"country": fmt_country(country), "sections": sections, "seo": seo}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — COUNTRIES CRUD
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("")
def list_countries(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    countries = db.query(Country).order_by(Country.display_order, Country.id).all()
    return [fmt_country(c) for c in countries]


@admin_router.post("")
def create_country(payload: CountryCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    # Duplicate check
    if db.query(Country).filter(Country.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Country name already exists.")
    if db.query(Country).filter(Country.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="Slug already exists.")

    country = Country(**payload.model_dump())
    db.add(country)
    db.commit()
    db.refresh(country)
    return fmt_country(country)


# NOTE: /reorder and /upload MUST be declared before /{id} to avoid path conflicts
@admin_router.post("/reorder")
def reorder_countries(payload: CountryReorder, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    for order, country_id in enumerate(payload.ordered_ids):
        db.query(Country).filter(Country.id == country_id).update({"display_order": order})
    db.commit()
    return {"success": True}


@admin_router.post("/upload")
async def upload_country_image(
    file: UploadFile = File(...),
    sub_folder: str = Form(...),
    admin: Admin = Depends(get_current_admin)
):
    path = save_country_image(file, sub_folder)
    return {"success": True, "path": path}


@admin_router.put("/{country_id}")
def update_country(country_id: int, payload: CountryUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")

    # Duplicate slug check (exclude self)
    if payload.slug and payload.slug != country.slug:
        if db.query(Country).filter(Country.slug == payload.slug, Country.id != country_id).first():
            raise HTTPException(status_code=400, detail="Slug already in use.")
    if payload.name and payload.name != country.name:
        if db.query(Country).filter(Country.name == payload.name, Country.id != country_id).first():
            raise HTTPException(status_code=400, detail="Country name already in use.")

    update_data = payload.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(country, key, val)

    db.commit()
    db.refresh(country)
    return fmt_country(country)


@admin_router.delete("/{country_id}")
def delete_country(country_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
    db.delete(country)
    db.commit()
    return {"success": True, "id": country_id}


@admin_router.patch("/{country_id}/toggle")
def toggle_country(country_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
    country.is_active = not country.is_active
    db.commit()
    return {"success": True, "id": country_id, "is_active": country.is_active}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — SECTIONS CRUD
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("/{country_id}/sections")
def list_sections(country_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    sections = (
        db.query(CountryPageSection)
        .filter(CountryPageSection.country_id == country_id)
        .order_by(CountryPageSection.section_order)
        .all()
    )
    return [fmt_section(s) for s in sections]


@admin_router.post("/{country_id}/sections")
def create_section(country_id: int, payload: CountrySectionCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
    section = CountryPageSection(country_id=country_id, **payload.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return fmt_section(section)


# /sections/reorder BEFORE /sections/{sid}
@admin_router.post("/{country_id}/sections/reorder")
def reorder_sections(country_id: int, payload: SectionReorder, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    for order, section_id in enumerate(payload.ordered_ids):
        db.query(CountryPageSection).filter(
            CountryPageSection.id == section_id,
            CountryPageSection.country_id == country_id
        ).update({"section_order": order})
    db.commit()
    return {"success": True}


@admin_router.put("/{country_id}/sections/{section_id}")
def update_section(country_id: int, section_id: int, payload: CountrySectionUpdate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    section = db.query(CountryPageSection).filter(
        CountryPageSection.id == section_id,
        CountryPageSection.country_id == country_id
    ).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
    update_data = payload.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(section, key, val)
    db.commit()
    db.refresh(section)
    return fmt_section(section)


@admin_router.delete("/{country_id}/sections/{section_id}")
def delete_section(country_id: int, section_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    section = db.query(CountryPageSection).filter(
        CountryPageSection.id == section_id,
        CountryPageSection.country_id == country_id
    ).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
    db.delete(section)
    db.commit()
    return {"success": True, "id": section_id}


@admin_router.patch("/{country_id}/sections/{section_id}/toggle")
def toggle_section(country_id: int, section_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    section = db.query(CountryPageSection).filter(
        CountryPageSection.id == section_id,
        CountryPageSection.country_id == country_id
    ).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
    section.is_active = not section.is_active
    db.commit()
    return {"success": True, "id": section_id, "is_active": section.is_active}


# ══════════════════════════════════════════════════════════════════════════════
# ADMIN — SEO
# ══════════════════════════════════════════════════════════════════════════════

@admin_router.get("/{country_id}/seo")
def get_seo(country_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    seo = db.query(CountrySEO).filter(CountrySEO.country_id == country_id).first()
    if not seo:
        return {}
    return fmt_seo(seo)


@admin_router.post("/{country_id}/seo")
def upsert_seo(country_id: int, payload: CountrySEOCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise HTTPException(status_code=404, detail="Country not found.")
    seo = db.query(CountrySEO).filter(CountrySEO.country_id == country_id).first()
    if seo:
        for key, val in payload.model_dump(exclude_unset=True).items():
            setattr(seo, key, val)
    else:
        seo = CountrySEO(country_id=country_id, **payload.model_dump())
        db.add(seo)
    db.commit()
    db.refresh(seo)
    return fmt_seo(seo)
