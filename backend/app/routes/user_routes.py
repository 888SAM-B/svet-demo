from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.security import get_password_hash, require_role
from ..models.user import User
from ..schemas.user_schema import UserCreate, UserUpdate, UserPasswordReset, UserResponse
from ..services.activity_service import log_activity

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Retrieve all users in the system (Master Admin Only)"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.post("", response_model=UserResponse)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Create a new user profile (Master Admin Only)"""
    email_clean = payload.email.strip().lower()
    
    # Check duplicate
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
        
    new_user = User(
        name=payload.name.strip(),
        email=email_clean,
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Creation",
        metadata={"created_user_id": new_user.id, "created_email": new_user.email, "role": new_user.role}
    )
    
    return new_user

@router.put("/{id}", response_model=UserResponse)
def update_user(
    id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Modify details of an existing user profile (Master Admin Only)"""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    email_clean = payload.email.strip().lower()
    
    # Duplicate check excluding self
    existing = db.query(User).filter(User.email == email_clean, User.id != id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already in use by another account"
        )
        
    # Track changed role or email for audit
    old_role = user.role
    old_email = user.email
    
    user.name = payload.name.strip()
    user.email = email_clean
    user.role = payload.role
    
    db.commit()
    db.refresh(user)
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={
            "updated_user_id": user.id,
            "old_email": old_email,
            "new_email": user.email,
            "old_role": old_role,
            "new_role": user.role
        }
    )
    
    return user

@router.delete("/{id}")
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Delete a user profile (Master Admin Only)"""
    if id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own master administrator profile."
        )
        
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user_email = user.email
    db.delete(user)
    db.commit()
    
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
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Activate or deactivate a user account (Master Admin Only)"""
    if id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own master administrator profile."
        )
        
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user.is_active = not user.is_active
    db.commit()
    
    action_str = "User Activated" if user.is_active else "User Deactivated"
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={"target_user_id": id, "state": action_str, "target_email": user.email}
    )
    
    return {"success": True, "id": id, "is_active": user.is_active}

@router.patch("/{id}/reset-password")
def reset_password(
    id: int,
    payload: UserPasswordReset,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["MASTER_ADMIN"]))
):
    """Reset the password for a user account (Master Admin Only)"""
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user.password_hash = get_password_hash(payload.password)
    db.commit()
    
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Updates",
        metadata={"target_user_id": id, "state": "Password Reset", "target_email": user.email}
    )
    
    return {"success": True, "detail": "Password successfully reset."}
