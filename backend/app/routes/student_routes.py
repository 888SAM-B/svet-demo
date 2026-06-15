import os
import json
import re
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..core.database import get_db
from ..core.security import decode_access_token
from ..models.admin import Admin
from ..models.student import Student, StudentDocument
from ..schemas.student_schema import StudentPayload, StudentStatusUpdate
from ..services.file_service import file_service

router = APIRouter(prefix="/students", tags=["Students"])
files_router = APIRouter(prefix="/files/students", tags=["Files"])
security_scheme = HTTPBearer()

# Auth Dependency
def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Admin:
    """Dependency to validate admin Bearer JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again."
        )
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing subject identifiers."
        )
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorized admin profile not found."
        )
    return admin


# Format Helper for Nested Frontend Response
def format_student(student: Student) -> dict:
    # Build dictionary of uploaded documents
    doc_dict = {doc.document_type: doc.stored_filename for doc in student.documents}
    
    # Ensure standard schema defaults are populated if documents are missing
    for d_type in ['marksheet', 'neetApp', 'neetScore', 'photo', 'tc', 'passportFront']:
        if d_type not in doc_dict:
            doc_dict[d_type] = ""

    return {
        "id": student.application_id,  # Map to application ID string for frontend compatibility
        "db_id": student.id,
        "personal": {
            "name": student.full_name,
            "gender": student.gender or "",
            "dob": student.date_of_birth.isoformat() if student.date_of_birth else "",
            "aadhaar": student.aadhaar_number or "",
            "community": student.community or "",
            "passportNo": student.passport_number or ""
        },
        "parent": {
            "parentName": student.father_name or "",
            "mobile1": student.parent_mobile or "",
            "mobile2": student.parent_mobile2 or "",
            "address": student.address or "",
            "district": student.district or "",
            "pincode": student.pincode or ""
        },
        "academic": {
            "hscGroup": student.hsc_group or "",
            "hscRegisterNo": student.hsc_register_no or "",
            "physicsMarks": student.physics_mark or 0,
            "chemistryMarks": student.chemistry_mark or 0,
            "biologyMarks": student.biology_mark or 0,
            "totalMarks": student.total_mark or 0
        },
        "neet": {
            "score": student.neet_score or 0,
            "applicationNumber": student.neet_application_number or "",
            "interestedCountry": student.preferred_country or ""
        },
        "documents": doc_dict,
        "status": student.status,
        "createdDate": student.created_at.isoformat() if student.created_at else datetime.now(timezone.utc).isoformat()
    }


@router.post("/apply")
async def apply(
    payload: str = Form(...),
    marksheet: UploadFile = File(...),
    neetApp: UploadFile = File(...),
    neetScore: UploadFile = File(...),
    photo: UploadFile = File(...),
    tc: UploadFile = File(...),
    passportFront: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Saves student data and files to MySQL & uploads directory"""
    try:
        data_dict = json.loads(payload)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON format in payload field")

    # Validate structural fields via Pydantic
    try:
        validated_data = StudentPayload(**data_dict)
    except Exception as err:
        raise HTTPException(status_code=422, detail=f"Validation error: {err}")

    # Generate next sequential application_id
    latest_student = db.query(Student).order_by(Student.id.desc()).first()
    next_num = 21  # Default seed start index (mockStudents defaults to 20)
    if latest_student:
        match = re.search(r'SVET-2026-(\d+)', latest_student.application_id)
        if match:
            next_num = int(match.group(1)) + 1
            if next_num < 21:
                next_num = 21
                
    application_id = f"SVET-2026-{next_num:03d}"

    # Parse date of birth
    dob_parsed = None
    if validated_data.personal.dob:
        try:
            dob_parsed = datetime.strptime(validated_data.personal.dob, "%Y-%m-%d").date()
        except ValueError:
            pass

    # Create Student Database entry
    new_student = Student(
        application_id=application_id,
        full_name=validated_data.personal.name,
        email=None,
        mobile=validated_data.parent.mobile1,
        aadhaar_number=validated_data.personal.aadhaar,
        date_of_birth=dob_parsed,
        gender=validated_data.personal.gender,
        address=validated_data.parent.address,
        
        community=validated_data.personal.community,
        passport_number=validated_data.personal.passportNo,
        district=validated_data.parent.district,
        pincode=validated_data.parent.pincode,
        hsc_group=validated_data.academic.hscGroup,
        hsc_register_no=validated_data.academic.hscRegisterNo,
        parent_mobile2=validated_data.parent.mobile2,
        
        father_name=validated_data.parent.parentName,
        parent_mobile=validated_data.parent.mobile1,
        
        physics_mark=validated_data.academic.physicsMarks,
        chemistry_mark=validated_data.academic.chemistryMarks,
        biology_mark=validated_data.academic.biologyMarks,
        total_mark=validated_data.academic.totalMarks,
        percentage=(validated_data.academic.physicsMarks + validated_data.academic.chemistryMarks + validated_data.academic.biologyMarks) / 3.0,
        
        neet_application_number=validated_data.neet.applicationNumber,
        neet_score=validated_data.neet.score,
        preferred_country=validated_data.neet.interestedCountry,
        status="Pending Review"
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Process and save documents
    files_to_process = {
        "marksheet": marksheet,
        "neetApp": neetApp,
        "neetScore": neetScore,
        "photo": photo,
        "tc": tc
    }
    if passportFront:
        files_to_process["passportFront"] = passportFront

    try:
        for doc_type, file_obj in files_to_process.items():
            saved_meta = file_service.save_student_file(file_obj, application_id, doc_type)
            db_doc = StudentDocument(
                student_id=new_student.id,
                document_type=doc_type,
                original_filename=saved_meta["original_filename"],
                stored_filename=saved_meta["stored_filename"],
                file_path=saved_meta["file_path"],
                mime_type=saved_meta["mime_type"],
                file_size=saved_meta["file_size"]
            )
            db.add(db_doc)
            
        db.commit()
        db.refresh(new_student)
    except Exception as e:
        # Cleanup incomplete DB writes
        db.delete(new_student)
        db.commit()
        file_service.delete_student_folder(application_id)
        raise e

    return format_student(new_student)


@router.get("")
def get_students(
    search: Optional[str] = None,
    country: Optional[str] = None,
    status: Optional[str] = None,
    date_range: Optional[str] = "all",
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Retrieve all student leads with filtering capabilities"""
    query = db.query(Student)

    if search:
        s_term = f"%{search}%"
        query = query.filter(
            or_(
                Student.full_name.like(s_term),
                Student.parent_mobile.like(s_term),
                Student.neet_application_number.like(s_term),
                Student.application_id.like(s_term)
            )
        )

    if country:
        query = query.filter(Student.preferred_country == country)

    if status:
        query = query.filter(Student.status == status)

    if date_range and date_range != "all":
        today = datetime.now().date()
        if date_range == "today":
            query = query.filter(Student.created_at >= today)
        elif date_range == "last7":
            query = query.filter(Student.created_at >= today - timedelta(days=7))
        elif date_range == "last30":
            query = query.filter(Student.created_at >= today - timedelta(days=30))

    students = query.order_by(Student.created_at.desc()).all()
    return [format_student(s) for s in students]


@router.get("/{student_id}")
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Get single student record detail"""
    student = db.query(Student).filter(Student.application_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    return format_student(student)


@router.patch("/{student_id}/status")
def update_status(
    student_id: str,
    payload: StudentStatusUpdate,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Updates status or notes fields for student"""
    student = db.query(Student).filter(Student.application_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    student.status = payload.status
    if payload.notes:
        student.notes = payload.notes
        
    db.commit()
    return {"success": True, "id": student_id, "status": student.status}


@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Deletes student record and removes local document uploads safely"""
    student = db.query(Student).filter(Student.application_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    db.delete(student)
    db.commit()
    
    # Safe storage directory wipe
    file_service.delete_student_folder(student_id)
    return {"success": True, "id": student_id}


# Secure file serving route - placed here for clean routing setup
@files_router.get("/{application_id}/{filename}")
def serve_file(
    application_id: str,
    filename: str,
    admin: Admin = Depends(get_current_admin)
):
    """Protected file endpoint returning FileResponse for authorized admins"""
    file_path = file_service.get_student_file_path(application_id, filename)
    return FileResponse(file_path)


@router.post("/reset")
def reset_demo(
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Deletes all student records, deletes upload directories, and returns empty database state"""
    students = db.query(Student).all()
    for s in students:
        file_service.delete_student_folder(s.application_id)
        
    db.query(StudentDocument).delete()
    db.query(Student).delete()
    db.commit()
    return []

