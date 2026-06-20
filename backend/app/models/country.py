from sqlalchemy import Column, Integer, String, Text, Boolean, Numeric, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    flag_image = Column(Text, nullable=True)
    card_image = Column(Text, nullable=True)
    short_description = Column(Text, nullable=True)
    starting_fee = Column(Numeric(12, 2), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    sections = relationship(
        "CountryPageSection",
        back_populates="country",
        cascade="all, delete-orphan",
        order_by="CountryPageSection.section_order"
    )
    seo = relationship(
        "CountrySEO",
        back_populates="country",
        uselist=False,
        cascade="all, delete-orphan"
    )


class CountryPageSection(Base):
    __tablename__ = "country_page_sections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="CASCADE"), nullable=False)
    section_type = Column(String(50), nullable=False)
    section_title = Column(String(255), nullable=True)
    section_order = Column(Integer, default=0)
    content_json = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    country = relationship("Country", back_populates="sections")


class CountrySEO(Base):
    __tablename__ = "country_seo"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="CASCADE"), unique=True, nullable=False)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)
    og_image = Column(Text, nullable=True)

    country = relationship("Country", back_populates="seo")
