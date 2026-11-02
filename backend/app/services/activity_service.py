from typing import Optional, Any
from datetime import datetime, timezone
from ..core.database import get_next_sequence

def log_activity(db, user_id: Optional[int], action: str, metadata: Optional[Any] = None) -> Optional[dict]:
    """
    Log an administrative action into MongoDB activity_logs collection.
    """
    try:
        log_id = get_next_sequence("activity_logs")
        log_entry = {
            "id": log_id,
            "user_id": user_id,
            "action": action,
            "timestamp": datetime.now(timezone.utc),
            "metadata_json": metadata
        }
        db.activity_logs.insert_one(log_entry)
        return log_entry
    except Exception as e:
        print(f"[Activity Logging Error] Failed to log action '{action}': {e}")
        return None
