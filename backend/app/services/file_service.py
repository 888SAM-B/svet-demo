import os
import shutil
import re
from fastapi import UploadFile, HTTPException
from ..core.config import settings

class FileService:
    ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png"}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes

    @classmethod
    def validate_file(cls, file: UploadFile):
        """Verify file type and size constraint checks (max 5MB, PDF/JPG/PNG)"""
        # Validate extension
        filename = file.filename or ""
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in cls.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File extension '.{ext}' is not allowed. Choose from: {', '.join(cls.ALLOWED_EXTENSIONS)}"
            )

        # Validate size (requires reading the file header or parsing file stream)
        # We can seek the end of the file or read it to check size, then seek back
        try:
            file.file.seek(0, os.SEEK_END)
            size = file.file.tell()
            file.file.seek(0)  # Reset pointer to start
            
            if size > cls.MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail=f"File size of {size / (1024*1024):.2f}MB exceeds the maximum allowed limit of 5MB."
                )
            return size
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=400, detail="Unable to read file contents for size validation")

    @classmethod
    def save_student_file(cls, file: UploadFile, application_id: str, document_type: str) -> dict:
        """Saves student files inside backend/app/uploads/students/<application_id>/"""
        # Clean application ID to prevent path traversal
        clean_app_id = re.sub(r'[^a-zA-Z0-9\-]', '', application_id)
        if not clean_app_id:
            raise HTTPException(status_code=400, detail="Invalid application ID format")
            
        file_size = cls.validate_file(file)
        
        # Clean original filename
        orig_filename = file.filename or "unknown"
        safe_orig_name = os.path.basename(orig_filename)  # strip potential folder structure
        ext = safe_orig_name.split(".")[-1].lower() if "." in safe_orig_name else "dat"
        
        # Build stored filename format: <document_type>.<extension> (e.g. marksheet.pdf)
        stored_filename = f"{document_type}.{ext}"
        
        # Setup student destination folder
        dest_dir = os.path.join(settings.UPLOAD_DIR, "students", clean_app_id)
        os.makedirs(dest_dir, exist_ok=True)
        
        dest_path = os.path.join(dest_dir, stored_filename)
        
        # Check path traversal
        real_dest_dir = os.path.realpath(dest_dir)
        real_uploads_dir = os.path.realpath(settings.UPLOAD_DIR)
        if not real_dest_dir.startswith(real_uploads_dir):
            raise HTTPException(status_code=400, detail="Path traversal detected in upload operation")
            
        try:
            with open(dest_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to write file to disk: {e}")
            
        return {
            "original_filename": safe_orig_name,
            "stored_filename": stored_filename,
            "file_path": dest_path,
            "mime_type": file.content_type,
            "file_size": file_size
        }

    @classmethod
    def delete_student_folder(cls, application_id: str):
        """Safely delete only that student's upload folder. Prevent path traversal."""
        clean_app_id = re.sub(r'[^a-zA-Z0-9\-]', '', application_id)
        if not clean_app_id:
            return
            
        target_dir = os.path.join(settings.UPLOAD_DIR, "students", clean_app_id)
        
        # Confirm directory exists and resolves safely within UPLOAD_DIR before deleting
        if os.path.exists(target_dir):
            real_target = os.path.realpath(target_dir)
            real_students_dir = os.path.realpath(os.path.join(settings.UPLOAD_DIR, "students"))
            
            # Strict safety check to prevent system deletions or traversal
            if real_target.startswith(real_students_dir) and real_target != real_students_dir:
                try:
                    shutil.rmtree(target_dir)
                    print(f"[FileService] Successfully deleted folder for {application_id}")
                except Exception as e:
                    print(f"[FileService] Error deleting folder for {application_id}: {e}")

    @classmethod
    def get_student_file_path(cls, application_id: str, filename: str) -> str:
        """Safely resolve student file path checking for traversal"""
        clean_app_id = re.sub(r'[^a-zA-Z0-9\-]', '', application_id)
        safe_filename = os.path.basename(filename)
        
        target_path = os.path.join(settings.UPLOAD_DIR, "students", clean_app_id, safe_filename)
        real_target = os.path.realpath(target_path)
        
        # Verify it lives inside upload directory
        real_students_dir = os.path.realpath(os.path.join(settings.UPLOAD_DIR, "students"))
        if not real_target.startswith(real_students_dir):
            raise HTTPException(status_code=400, detail="Path traversal attempt detected")
            
        if not os.path.exists(real_target):
            raise HTTPException(status_code=404, detail="Requested document file not found")
            
        return real_target

file_service = FileService()
