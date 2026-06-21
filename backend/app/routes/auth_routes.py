from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_password, create_access_token, require_role
from ..models.user import User
from ..schemas.auth_schema import AuthLogin, Token, UserInfo
from ..services.activity_service import log_activity

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: AuthLogin, db: Session = Depends(get_db)):
    """Authenticates user and returns a signed access JWT with role claims"""
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is deactivated. Please contact the administrator."
        )
        
    # Generate token
    access_token = create_access_token(user_id=user.id, role=user.role)
    
    # Audit log
    log_activity(
        db=db,
        user_id=user.id,
        action="User Login",
        metadata={"email": user.email, "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        }
    }

@router.post("/logout")
def logout(
    current_user: User = Depends(require_role(["MASTER_ADMIN", "LEAD_MANAGER", "COUNTRY_MANAGER"])),
    db: Session = Depends(get_db)
):
    """Logs out user session and records the audit log"""
    log_activity(
        db=db,
        user_id=current_user.id,
        action="User Logout",
        metadata={"email": current_user.email}
    )
    return {"success": True, "detail": "Successfully logged out."}

@router.get("/me", response_model=UserInfo)
def get_me(current_user: User = Depends(require_role(["MASTER_ADMIN", "LEAD_MANAGER", "COUNTRY_MANAGER"]))):
    """Retrieve profile information for the currently authenticated user session"""
    return current_user
