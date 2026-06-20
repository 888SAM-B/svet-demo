from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func
from ..core.database import Base


class HomepageGalleryImage(Base):
    __tablename__ = "homepage_gallery_images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    image_path = Column(Text, nullable=False)
    title = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
