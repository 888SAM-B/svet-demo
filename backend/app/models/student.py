from sqlalchemy import Column, Integer, String, Date, Text, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=True)
    mobile = Column(String(20), nullable=False)
    aadhaar_number = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(30), nullable=True)
    address = Column(Text, nullable=True)
    
    # Custom additional columns matching all frontend form inputs
    community = Column(String(50), nullable=True)
    passport_number = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    hsc_group = Column(String(100), nullable=True)
    hsc_register_no = Column(String(100), nullable=True)
    parent_mobile2 = Column(String(20), nullable=True)

    # Parent Details
    father_name = Column(String(150), nullable=True)
    mother_name = Column(String(150), nullable=True)
    parent_mobile = Column(String(20), nullable=True)
    parent_email = Column(String(150), nullable=True)
    parent_occupation = Column(String(150), nullable=True)

    # Academic Details
    school_name = Column(String(200), nullable=True)
    board = Column(String(100), nullable=True)
    passing_year = Column(String(10), nullable=True)
    physics_mark = Column(Integer, nullable=True)
    chemistry_mark = Column(Integer, nullable=True)
    biology_mark = Column(Integer, nullable=True)
    english_mark = Column(Integer, nullable=True, default=0)
    language_mark = Column(Integer, nullable=True, default=0)
    total_mark = Column(Integer, nullable=True)
    percentage = Column(Numeric(5, 2), nullable=True)

    # NEET Details
    neet_roll_number = Column(String(100), nullable=True)
    neet_application_number = Column(String(100), nullable=True)
    neet_score = Column(Integer, nullable=True)
    neet_percentile = Column(Numeric(6, 2), nullable=True)

    # Preference Details
    preferred_country = Column(String(100), nullable=True)
    preferred_course = Column(String(100), default="MBBS")
    budget_range = Column(String(100), nullable=True)

    # Lead Tracking Status
    status = Column(String(50), default="Pending Review")
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Establish one-to-many cascading relationship with documents table
    documents = relationship("StudentDocument", back_populates="student", cascade="all, delete-orphan")


class StudentDocument(Base):
    __tablename__ = "student_documents"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(100), nullable=False)  # e.g., 'marksheet', 'neetApp', 'neetScore', 'photo', 'tc', 'passportFront'
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, server_default=func.now())

    # Relationship back to student parent
    student = relationship("Student", back_populates="documents")
