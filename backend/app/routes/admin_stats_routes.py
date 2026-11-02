from fastapi import APIRouter, Depends
from ..core.database import get_db
from ..core.security import require_role, DotDict

router = APIRouter(prefix="/admin-stats", tags=["Administration Management"])

@router.get("/metrics")
def get_admin_stats(
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Aggregate statistics counts for leads, countries, gallery items, and users"""
    total_leads = db.contact_enquiries.count_documents({})
    total_countries = db.countries.count_documents({})
    total_gallery = db.homepage_gallery_images.count_documents({})
    total_users = db.users.count_documents({})
    
    return {
        "users_count": total_users,
        "leads_count": total_leads,
        "countries_count": total_countries,
        "gallery_count": total_gallery
    }

@router.get("/logs")
def get_audit_logs(
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Retrieve the recent system audit logs for administrative overview"""
    logs = list(db.activity_logs.find({}).sort("timestamp", -1).limit(100))
    
    # Pre-fetch users for name/email lookup
    user_ids = list({log.get("user_id") for log in logs if log.get("user_id") is not None})
    users_map = {u["id"]: u for u in db.users.find({"id": {"$in": user_ids}})} if user_ids else {}
    
    result = []
    for log in logs:
        u = users_map.get(log.get("user_id"))
        ts = log.get("timestamp")
        ts_iso = ts.isoformat() if hasattr(ts, "isoformat") else str(ts) if ts else None
        result.append({
            "id": log.get("id"),
            "user_id": log.get("user_id"),
            "user_name": u.get("name") if u else "System/Anonymous",
            "user_email": u.get("email") if u else None,
            "action": log.get("action"),
            "timestamp": ts_iso,
            "metadata": log.get("metadata_json")
        })
    return result
