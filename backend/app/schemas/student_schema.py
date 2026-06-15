from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict
import re

class StudentPersonal(BaseModel):
    name: str = Field(..., min_length=1)
    gender: str = Field(..., min_length=1)
    dob: str = Field(..., min_length=1)  # YYYY-MM-DD
    aadhaar: str = Field(..., min_length=12, max_length=12)
    community: str = Field(..., min_length=1)
    passportNo: Optional[str] = ""

    @field_validator('aadhaar')
    def validate_aadhaar(cls, v):
        cleaned = re.sub(r'\s', '', v)
        if not cleaned.isdigit() or len(cleaned) != 12:
            raise ValueError('Aadhaar must be a 12-digit number')
        return cleaned

class StudentParent(BaseModel):
    parentName: str = Field(..., min_length=1)
    mobile1: str = Field(..., min_length=10, max_length=10)
    mobile2: Optional[str] = ""
    address: str = Field(..., min_length=1)
    district: str = Field(..., min_length=1)
    pincode: str = Field(..., min_length=6, max_length=6)

    @field_validator('mobile1')
    def validate_mobile(cls, v):
        if not v.isdigit() or len(v) != 10:
            raise ValueError('Mobile number must be a 10-digit number')
        return v

    @field_validator('pincode')
    def validate_pincode(cls, v):
        if not v.isdigit() or len(v) != 6:
            raise ValueError('Pincode must be a 6-digit number')
        return v

class StudentAcademic(BaseModel):
    hscGroup: str = Field(..., min_length=1)
    hscRegisterNo: str = Field(..., min_length=1)
    physicsMarks: int
    chemistryMarks: int
    biologyMarks: int
    totalMarks: int

    @field_validator('physicsMarks', 'chemistryMarks', 'biologyMarks')
    def validate_marks(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Marks must be between 0 and 100')
        return v

class StudentNeet(BaseModel):
    score: int
    applicationNumber: str = Field(..., min_length=1)
    interestedCountry: str = Field(..., min_length=1)

    @field_validator('score')
    def validate_neet_score(cls, v):
        if v < 0 or v > 720:
            raise ValueError('NEET score must be between 0 and 720')
        return v

class StudentPayload(BaseModel):
    personal: StudentPersonal
    parent: StudentParent
    academic: StudentAcademic
    neet: StudentNeet

class StudentStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = ""

class StudentDocumentResponse(BaseModel):
    document_type: str
    original_filename: str
    stored_filename: str
    file_path: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None
