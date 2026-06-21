from sqlalchemy.orm import Session
from typing import Optional, Any
from ..models.activity_log import ActivityLog

def log_activity(db: Session, user_id: Optional[int], action: str, metadata: Optional[Any] = None) -> ActivityLog:
    """
    Log an administrative action in the audit logs.
    """
    try:
        log_entry = ActivityLog(
            user_id=user_id,
            action=action,
            metadata_json=metadata
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as e:
        print(f"[Activity Logging Error] Failed to log action '{action}': {e}")
        db.rollback()
        return None
