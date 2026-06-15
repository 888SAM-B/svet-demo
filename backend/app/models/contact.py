from sqlalchemy import Column, Integer, String, Text, DateTime, func
from ..core.database import Base

class ContactEnquiry(Base):
    __tablename__ = "contact_enquiries"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=True)
    mobile = Column(String(20), nullable=True)
    message = Column(Text, nullable=True)
    preferred_country = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
