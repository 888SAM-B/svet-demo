import os
import json
import re
from datetime import datetime, timezone, timedelta, date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status
from fastapi.responses import FileResponse
from pymongo import ReturnDocument

from ..core.database import get_db, get_next_sequence
from ..core.security import require_role, DotDict
from ..schemas.student_schema import StudentPayload, StudentStatusUpdate, StudentStatusQuery
from ..services.file_service import file_service
from ..services.activity_service import log_activity

router = APIRouter(prefix="/students", tags=["Students"])
files_router = APIRouter(prefix="/files/students", tags=["Files"])

# Auth Dependency - mapped to RBAC user validation
get_current_admin = require_role(["MASTER_ADMIN", "LEAD_MANAGER"])


# Format Helper for Nested Frontend Response
def format_student(student: dict) -> dict:
    # Build dictionary of uploaded documents
    raw_docs = student.get("documents", [])
    doc_dict = {}
    if isinstance(raw_docs, list):
        for doc in raw_docs:
            if isinstance(doc, dict):
                doc_dict[doc.get("document_type", "")] = doc.get("stored_filename", "")
    
    # Ensure standard schema defaults are populated if documents are missing
    for d_type in ['marksheet', 'neetApp', 'neetScore', 'photo', 'tc', 'passportFront']:
        if d_type not in doc_dict:
            doc_dict[d_type] = ""

    dob = student.get("date_of_birth")
    if isinstance(dob, (datetime, date)):
        dob_str = dob.strftime("%Y-%m-%d")
    else:
        dob_str = str(dob) if dob else ""

    created = student.get("created_at")
    created_str = created.isoformat() if hasattr(created, "isoformat") else str(created) if created else datetime.now(timezone.utc).isoformat()

    return {
        "id": student.get("application_id"),  # Map to application ID string for frontend compatibility
        "db_id": student.get("id"),
        "personal": {
            "name": student.get("full_name", ""),
            "gender": student.get("gender") or "",
            "dob": dob_str,
            "aadhaar": student.get("aadhaar_number") or "",
            "community": student.get("community") or "",
            "passportNo": student.get("passport_number") or ""
        },
        "parent": {
            "parentName": student.get("father_name") or "",
            "mobile1": student.get("parent_mobile") or student.get("mobile") or "",
            "mobile2": student.get("parent_mobile2") or "",
            "address": student.get("address") or "",
            "district": student.get("district") or "",
            "pincode": student.get("pincode") or ""
        },
        "academic": {
            "hscGroup": student.get("hsc_group") or "",
            "hscRegisterNo": student.get("hsc_register_no") or "",
            "physicsMarks": student.get("physics_mark") or 0,
            "chemistryMarks": student.get("chemistry_mark") or 0,
            "biologyMarks": student.get("biology_mark") or 0,
            "totalMarks": student.get("total_mark") or 0
        },
        "neet": {
            "score": student.get("neet_score") or 0,
            "applicationNumber": student.get("neet_application_number") or "",
            "interestedCountry": student.get("preferred_country") or ""
        },
        "documents": doc_dict,
        "status": student.get("status", "Pending Review"),
        "createdDate": created_str
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
    db = Depends(get_db)
):
    """Saves student data and files to MongoDB & uploads directory"""
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
    latest_student = db.students.find_one({}, sort=[("id", -1)])
    next_num = 21  # Default seed start index (mockStudents defaults to 20)
    if latest_student and latest_student.get("application_id"):
        match = re.search(r'SVET-2026-(\d+)', latest_student["application_id"])
        if match:
            next_num = int(match.group(1)) + 1
            if next_num < 21:
                next_num = 21
                
    application_id = f"SVET-2026-{next_num:03d}"

    # Parse date of birth
    dob_parsed = None
    if validated_data.personal.dob:
        try:
            dob_parsed = datetime.strptime(validated_data.personal.dob, "%Y-%m-%d")
        except ValueError:
            pass

    student_id = get_next_sequence("students")
    now = datetime.now(timezone.utc)

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

    docs_list = []
    try:
        for doc_type, file_obj in files_to_process.items():
            saved_meta = file_service.save_student_file(file_obj, application_id, doc_type)
            doc_id = get_next_sequence("student_documents")
            db_doc = {
                "id": doc_id,
                "student_id": student_id,
                "document_type": doc_type,
                "original_filename": saved_meta["original_filename"],
                "stored_filename": saved_meta["stored_filename"],
                "file_path": saved_meta["file_path"],
                "mime_type": saved_meta["mime_type"],
                "file_size": saved_meta["file_size"],
                "uploaded_at": now
            }
            docs_list.append(db_doc)
            db.student_documents.insert_one(db_doc)

        new_student = {
            "id": student_id,
            "application_id": application_id,
            "full_name": validated_data.personal.name,
            "email": None,
            "mobile": validated_data.parent.mobile1,
            "aadhaar_number": validated_data.personal.aadhaar,
            "date_of_birth": dob_parsed,
            "gender": validated_data.personal.gender,
            "address": validated_data.parent.address,
            
            "community": validated_data.personal.community,
            "passport_number": validated_data.personal.passportNo,
            "district": validated_data.parent.district,
            "pincode": validated_data.parent.pincode,
            "hsc_group": validated_data.academic.hscGroup,
            "hsc_register_no": validated_data.academic.hscRegisterNo,
            "parent_mobile2": validated_data.parent.mobile2,
            
            "father_name": validated_data.parent.parentName,
            "parent_mobile": validated_data.parent.mobile1,
            
            "physics_mark": validated_data.academic.physicsMarks,
            "chemistry_mark": validated_data.academic.chemistryMarks,
            "biology_mark": validated_data.academic.biologyMarks,
            "total_mark": validated_data.academic.totalMarks,
            "percentage": float((validated_data.academic.physicsMarks + validated_data.academic.chemistryMarks + validated_data.academic.biologyMarks) / 3.0),
            
            "neet_application_number": validated_data.neet.applicationNumber,
            "neet_score": validated_data.neet.score,
            "preferred_country": validated_data.neet.interestedCountry,
            "preferred_course": "MBBS",
            "budget_range": None,
            "status": "Pending Review",
            "notes": None,
            "created_at": now,
            "updated_at": now,
            "documents": docs_list
        }
        db.students.insert_one(new_student)

    except Exception as e:
        # Cleanup
        db.students.delete_one({"id": student_id})
        db.student_documents.delete_many({"student_id": student_id})
        file_service.delete_student_folder(application_id)
        raise e

    return format_student(new_student)


@router.post("/status")
def check_status(
    payload: StudentStatusQuery,
    db = Depends(get_db)
):
    """Retrieve application status and details publicly using identifier (Aadhaar or App ID) and DOB"""
    try:
        dob_parsed = datetime.strptime(payload.dob, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid Date of Birth format. Please use YYYY-MM-DD."
        )

    identifier_clean = payload.identifier.strip()

    # Match identifier against application_id or aadhaar_number, and match DOB
    # Date in MongoDB could be datetime or date string
    dob_start = dob_parsed.replace(hour=0, minute=0, second=0, microsecond=0)
    dob_end = dob_parsed.replace(hour=23, minute=59, second=59, microsecond=999999)

    student = db.students.find_one({
        "$and": [
            {
                "$or": [
                    {"application_id": identifier_clean},
                    {"aadhaar_number": identifier_clean}
                ]
            },
            {
                "$or": [
                    {"date_of_birth": {"$gte": dob_start, "$lte": dob_end}},
                    {"date_of_birth": payload.dob.strip()}
                ]
            }
        ]
    })

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Application not found. Check your Reference ID/Aadhaar & DOB."
        )

    return format_student(student)


@router.get("")
def get_students(
    search: Optional[str] = None,
    country: Optional[str] = None,
    status: Optional[str] = None,
    date_range: Optional[str] = "all",
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    """Retrieve all student leads with filtering capabilities"""
    query = {}

    if search:
        s_regex = {"$regex": re.escape(search.strip()), "$options": "i"}
        query["$or"] = [
            {"full_name": s_regex},
            {"parent_mobile": s_regex},
            {"mobile": s_regex},
            {"neet_application_number": s_regex},
            {"application_id": s_regex}
        ]

    if country:
        query["preferred_country"] = country

    if status:
        query["status"] = status

    if date_range and date_range != "all":
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        if date_range == "today":
            query["created_at"] = {"$gte": today}
        elif date_range == "last7":
            query["created_at"] = {"$gte": today - timedelta(days=7)}
        elif date_range == "last30":
            query["created_at"] = {"$gte": today - timedelta(days=30)}

    students = list(db.students.find(query).sort("created_at", -1))
    return [format_student(s) for s in students]


@router.get("/{student_id}")
def get_student(
    student_id: str,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    """Get single student record detail"""
    student = db.students.find_one({"application_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    return format_student(student)


@router.patch("/{student_id}/status")
def update_status(
    student_id: str,
    payload: StudentStatusUpdate,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    """Updates status or notes fields for student"""
    student = db.students.find_one({"application_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    old_status = student.get("status")
    update_data = {
        "status": payload.status,
        "updated_at": datetime.now(timezone.utc)
    }
    if payload.notes:
        update_data["notes"] = payload.notes
        
    db.students.update_one({"application_id": student_id}, {"$set": update_data})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Lead Updates",
        metadata={
            "student_id": student.get("id"),
            "application_id": student_id,
            "old_status": old_status,
            "new_status": payload.status,
            "student_name": student.get("full_name")
        }
    )
    
    return {"success": True, "id": student_id, "status": payload.status}


@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    """Deletes student record and removes local document uploads safely"""
    student = db.students.find_one({"application_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    student_id_db = student.get("id")
    student_name = student.get("full_name")
    
    db.students.delete_one({"application_id": student_id})
    db.student_documents.delete_many({"student_id": student_id_db})
    
    # Safe storage directory wipe
    file_service.delete_student_folder(student_id)
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Lead Updates",
        metadata={
            "student_id": student_id_db,
            "application_id": student_id,
            "deleted": True,
            "student_name": student_name
        }
    )
    
    return {"success": True, "id": student_id}


# Secure file serving route
@files_router.get("/{application_id}/{filename}")
def serve_file(
    application_id: str,
    filename: str,
    admin: DotDict = Depends(get_current_admin)
):
    """Protected file endpoint returning FileResponse for authorized admins"""
    file_path = file_service.get_student_file_path(application_id, filename)
    return FileResponse(file_path)


@router.post("/reset")
def reset_demo(
    db = Depends(get_db),
    admin: DotDict = Depends(get_current_admin)
):
    """Deletes all student records, deletes upload directories, and returns empty database state"""
    students = list(db.students.find({}))
    for s in students:
        app_id = s.get("application_id")
        if app_id:
            file_service.delete_student_folder(app_id)
        
    db.student_documents.delete_many({})
    db.students.delete_many({})
    
    log_activity(
        db=db,
        user_id=admin.id,
        action="Lead Updates",
        metadata={"reset_demo": True}
    )
    
    return []
