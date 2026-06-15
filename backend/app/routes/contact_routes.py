from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.contact import ContactEnquiry
from ..schemas.contact_schema import ContactCreate
from ..services.email_service import email_service

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("")
def create_contact_enquiry(payload: ContactCreate, db: Session = Depends(get_db)):
    """Creates a contact enquiry and dispatches transactional notification mail via Brevo"""
    # 1. Save enquiry to database
    enquiry = ContactEnquiry(
        name=payload.name,
        email=payload.email,
        mobile=payload.mobile,
        message=payload.message,
        preferred_country=payload.preferred_country
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    
    # 2. Forward to admin inbox using Brevo SMTP
    email_sent = email_service.send_enquiry_email(
        name=payload.name,
        email=payload.email,
        mobile=payload.mobile,
        message=payload.message,
        preferred_country=payload.preferred_country
    )
    
    return {
        "id": enquiry.id,
        "name": enquiry.name,
        "email": enquiry.email,
        "mobile": enquiry.mobile,
        "message": enquiry.message,
        "preferred_country": enquiry.preferred_country,
        "email_sent": email_sent
    }
