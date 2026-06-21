from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..core.database import get_db
from ..models.student import Student
from ..core.security import require_role
from ..models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

get_current_admin = require_role(["MASTER_ADMIN", "LEAD_MANAGER"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Aggregate CRM statistics for charts and cards"""
    # 1. Total registrations
    total_registrations = db.query(Student).count()
    
    # 2. Today's registrations
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_registrations = db.query(Student).filter(Student.created_at >= today_start).count()
    
    # 3. Pending review files
    pending_files = db.query(Student).filter(Student.status == "Pending Review").count()
    
    # 4. Total countries (with students applied)
    unique_countries = db.query(Student.preferred_country).distinct().count()
    # If database is clean, show at least the baseline count (e.g. 10)
    total_countries = max(10, unique_countries)
    
    # 5. Country Distribution shares
    country_shares = db.query(
        Student.preferred_country,
        func.count(Student.id).label("count")
    ).group_by(Student.preferred_country).order_by(func.count(Student.id).desc()).all()
    
    country_distribution = [
        {"country": item[0] or "Unknown", "count": item[1]} for item in country_shares
    ]
    
    # 6. Status distribution shares
    status_shares = db.query(
        Student.status,
        func.count(Student.id).label("count")
    ).group_by(Student.status).all()
    
    status_distribution = [
        {"status": item[0], "count": item[1]} for item in status_shares
    ]
    
    # 7. Application Trends (Group by Date for last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    trend_data = db.query(
        func.date(Student.created_at).label("date_label"),
        func.count(Student.id).label("count")
    ).filter(
        Student.created_at >= thirty_days_ago
    ).group_by(
        func.date(Student.created_at)
    ).order_by(
        func.date(Student.created_at)
    ).all()
    
    application_trends = []
    for item in trend_data:
        # Format date as 'Mon Day' e.g. 'Jun 15' to match Recharts ticks
        date_obj = item[0]
        if isinstance(date_obj, str):
            try:
                date_obj = datetime.strptime(date_obj, "%Y-%m-%d")
            except Exception:
                pass
        date_formatted = date_obj.strftime("%b %d") if hasattr(date_obj, "strftime") else str(date_obj)
        application_trends.append({
            "date": date_formatted,
            "count": item[1]
        })

    return {
        "total_registrations": total_registrations,
        "today_registrations": today_registrations,
        "pending_files": pending_files,
        "total_countries": total_countries,
        "country_distribution": country_distribution,
        "application_trends": application_trends,
        "status_distribution": status_distribution
    }
export_router = router
