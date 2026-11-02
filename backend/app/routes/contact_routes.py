from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from ..core.database import get_db, get_next_sequence
from ..schemas.contact_schema import ContactCreate
from ..services.email_service import email_service

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("")
def create_contact_enquiry(payload: ContactCreate, db = Depends(get_db)):
    """Creates a contact enquiry in MongoDB and dispatches transactional notification mail via Brevo"""
    # 1. Save enquiry to database
    enquiry_id = get_next_sequence("contact_enquiries")
    now = datetime.now(timezone.utc)
    enquiry = {
        "id": enquiry_id,
        "name": payload.name,
        "email": payload.email,
        "mobile": payload.mobile,
        "message": payload.message,
        "preferred_country": payload.preferred_country,
        "created_at": now
    }
    db.contact_enquiries.insert_one(enquiry)
    
    # 2. Forward to admin inbox using Brevo SMTP
    email_sent = email_service.send_enquiry_email(
        name=payload.name,
        email=payload.email,
        mobile=payload.mobile,
        message=payload.message,
        preferred_country=payload.preferred_country
    )
    
    return {
        "id": enquiry["id"],
        "name": enquiry["name"],
        "email": enquiry["email"],
        "mobile": enquiry["mobile"],
        "message": enquiry["message"],
        "preferred_country": enquiry["preferred_country"],
        "email_sent": email_sent
    }
