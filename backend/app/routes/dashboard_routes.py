from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from ..core.database import get_db
from ..core.security import require_role, DotDict

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

get_current_admin = require_role(["MASTER_ADMIN", "LEAD_MANAGER"])

@router.get("/stats")
def get_dashboard_stats(
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    """Aggregate CRM statistics for charts and cards with MongoDB"""
    # 1. Total registrations
    total_registrations = db.students.count_documents({})
    
    # 2. Today's registrations
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_registrations = db.students.count_documents({"created_at": {"$gte": today_start}})
    
    # 3. Pending review files
    pending_files = db.students.count_documents({"status": "Pending Review"})
    
    # 4. Total countries (with students applied)
    unique_countries = len(db.students.distinct("preferred_country"))
    total_countries = max(10, unique_countries)
    
    # 5. Country Distribution shares
    country_shares = list(db.students.aggregate([
        {"$group": {"_id": "$preferred_country", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]))
    country_distribution = [
        {"country": item["_id"] or "Unknown", "count": item["count"]}
        for item in country_shares
    ]
    
    # 6. Status distribution shares
    status_shares = list(db.students.aggregate([
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]))
    status_distribution = [
        {"status": item["_id"] or "Unknown", "count": item["count"]}
        for item in status_shares
    ]
    
    # 7. Application Trends (Group by Date for last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    trend_shares = list(db.students.aggregate([
        {"$match": {"created_at": {"$gte": thirty_days_ago}}},
        {
            "$group": {
                "_id": {
                    "$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]))
    
    application_trends = []
    for item in trend_shares:
        date_str = item.get("_id")
        date_formatted = date_str
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                date_formatted = date_obj.strftime("%b %d")
            except Exception:
                pass
        application_trends.append({
            "date": date_formatted,
            "count": item.get("count", 0)
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
