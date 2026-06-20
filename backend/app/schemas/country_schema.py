from pydantic import BaseModel, Field
from typing import Optional, Any, List, Dict


class CountryCreate(BaseModel):
    name: str = Field(..., min_length=1)
    slug: str = Field(..., min_length=1)
    short_description: Optional[str] = None
    starting_fee: Optional[float] = None
    flag_image: Optional[str] = None
    card_image: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class CountryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    starting_fee: Optional[float] = None
    flag_image: Optional[str] = None
    card_image: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class CountrySectionCreate(BaseModel):
    section_type: str
    section_title: Optional[str] = None
    section_order: int = 0
    content_json: Optional[Dict[str, Any]] = None
    is_active: bool = True


class CountrySectionUpdate(BaseModel):
    section_type: Optional[str] = None
    section_title: Optional[str] = None
    section_order: Optional[int] = None
    content_json: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class CountrySEOCreate(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None
    og_image: Optional[str] = None


class CountryReorder(BaseModel):
    ordered_ids: List[int]


class SectionReorder(BaseModel):
    ordered_ids: List[int]
