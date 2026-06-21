from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import require_role
from ..models.user import User
from ..models.student import Student
from ..models.contact import ContactEnquiry
from ..models.country import Country
from ..models.homepage_gallery import HomepageGalleryImage
from ..models.activity_log import ActivityLog

router = APIRouter(prefix="/admin-stats", tags=["Administration Management"])

@router.get("/metrics")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Aggregate statistics counts for leads, countries, gallery items, and users"""
    total_leads = db.query(ContactEnquiry).count()
    total_countries = db.query(Country).count()
    total_gallery = db.query(HomepageGalleryImage).count()
    total_users = db.query(User).count()
    
    return {
        "users_count": total_users,
        "leads_count": total_leads,
        "countries_count": total_countries,
        "gallery_count": total_gallery
    }

@router.get("/logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Retrieve the recent system audit logs for administrative overview"""
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(100).all()
    
    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "user_id": log.user_id,
            "user_name": log.user.name if log.user else "System/Anonymous",
            "user_email": log.user.email if log.user else None,
            "action": log.action,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "metadata": log.metadata_json
        })
    return result
