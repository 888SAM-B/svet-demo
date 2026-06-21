from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    metadata_json = Column(JSON, nullable=True)  # Named metadata_json to avoid name conflicts and mapped to JSON
    
    user = relationship("User")
