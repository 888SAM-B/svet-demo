from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument

from ..core.database import get_db, get_next_sequence
from ..core.security import get_password_hash, require_role, DotDict
from ..schemas.user_schema import UserCreate, UserUpdate, UserPasswordReset, UserResponse
from ..services.activity_service import log_activity

router = APIRouter(prefix="/users", tags=["User Management"])

def fmt_user(u: dict) -> dict:
    return {
        "id": u.get("id"),
        "name": u.get("name"),
        "email": u.get("email"),
        "role": u.get("role"),
        "is_active": u.get("is_active", True),
        "created_at": u.get("created_at"),
        "updated_at": u.get("updated_at")
    }

@router.get("", response_model=List[UserResponse])
def get_users(
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Retrieve all users in the system (Master Admin Only)"""
    users = list(db.users.find({}, {"_id": 0}).sort("created_at", -1))
    return [fmt_user(u) for u in users]

@router.post("", response_model=UserResponse)
def create_user(
    payload: UserCreate,
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Create a new user profile (Master Admin Only)"""
    email_clean = payload.email.strip().lower()
    
    # Check duplicate
    existing = db.users.find_one({"email": email_clean})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
        
    now = datetime.now(timezone.utc)
    user_id = get_next_sequence("users")
    new_user = {
        "id": user_id,
        "name": payload.name.strip(),
        "email": email_clean,
        "password_hash": get_password_hash(payload.password),
        "role": payload.role,
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }
    db.users.insert_one(new_user)
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Creation",
        metadata={"created_user_id": user_id, "created_email": email_clean, "role": payload.role}
    )
    
    return fmt_user(new_user)

@router.put("/{id}", response_model=UserResponse)
def update_user(
    id: int,
    payload: UserUpdate,
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Modify details of an existing user profile (Master Admin Only)"""
    user = db.users.find_one({"id": id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    email_clean = payload.email.strip().lower()
    
    # Duplicate check excluding self
    existing = db.users.find_one({"email": email_clean, "id": {"$ne": id}})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already in use by another account"
        )
        
    old_role = user.get("role")
    old_email = user.get("email")
    
    updated_user = db.users.find_one_and_update(
        {"id": id},
        {
            "$set": {
                "name": payload.name.strip(),
                "email": email_clean,
                "role": payload.role,
                "updated_at": datetime.now(timezone.utc)
            }
        },
        return_document=ReturnDocument.AFTER
    )
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={
            "updated_user_id": id,
            "old_email": old_email,
            "new_email": email_clean,
            "old_role": old_role,
            "new_role": payload.role
        }
    )
    
    return fmt_user(updated_user)

@router.delete("/{id}")
def delete_user(
    id: int,
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Delete a user profile (Master Admin Only)"""
    if id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own master administrator profile."
        )
        
    user = db.users.find_one({"id": id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user_email = user.get("email")
    db.users.delete_one({"id": id})
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={"deleted_user_id": id, "deleted_email": user_email}
    )
    
    return {"success": True, "detail": "User account successfully deleted."}

@router.patch("/{id}/toggle")
def toggle_user_active(
    id: int,
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Activate or deactivate a user account (Master Admin Only)"""
    if id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own master administrator profile."
        )
        
    user = db.users.find_one({"id": id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    new_active = not user.get("is_active", True)
    db.users.update_one(
        {"id": id},
        {
            "$set": {
                "is_active": new_active,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    action_str = "User Activated" if new_active else "User Deactivated"
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={"target_user_id": id, "state": action_str, "target_email": user.get("email")}
    )
    
    return {"success": True, "id": id, "is_active": new_active}

@router.patch("/{id}/reset-password")
def reset_password(
    id: int,
    payload: UserPasswordReset,
    db = Depends(get_db),
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN"]))
):
    """Reset the password for a user account (Master Admin Only)"""
    user = db.users.find_one({"id": id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    new_hash = get_password_hash(payload.password)
    db.users.update_one(
        {"id": id},
        {
            "$set": {
                "password_hash": new_hash,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={"target_user_id": id, "state": "Password Reset", "target_email": user.get("email")}
    )
    
    return {"success": True, "detail": "Password successfully reset."}
