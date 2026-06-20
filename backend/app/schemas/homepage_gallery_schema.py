from pydantic import BaseModel, Field
from typing import Optional, List


class HomepageGalleryImageCreate(BaseModel):
    image_path: str = Field(..., min_length=1)
    title: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class HomepageGalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class GalleryReorder(BaseModel):
    ordered_ids: List[int]
