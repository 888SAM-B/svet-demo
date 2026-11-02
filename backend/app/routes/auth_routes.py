from fastapi import APIRouter, Depends, HTTPException, status
from ..core.database import get_db
from ..core.security import verify_password, create_access_token, require_role, DotDict
from ..schemas.auth_schema import AuthLogin, Token, UserInfo
from ..services.activity_service import log_activity

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: AuthLogin, db = Depends(get_db)):
    """Authenticates user and returns a signed access JWT with role claims"""
    email_clean = payload.email.strip().lower()
    user = db.users.find_one({"email": email_clean})
    
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is deactivated. Please contact the administrator."
        )
        
    # Generate token
    user_id = user["id"]
    user_role = user["role"]
    access_token = create_access_token(user_id=user_id, role=user_role)
    
    # Audit log
    log_activity(
        db=db,
        user_id=user_id,
        action="User Login",
        metadata={"email": user.get("email"), "role": user_role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user_role,
            "is_active": user.get("is_active", True)
        }
    }

@router.post("/logout")
def logout(
    current_user: DotDict = Depends(require_role(["MASTER_ADMIN", "LEAD_MANAGER", "COUNTRY_MANAGER"])),
    db = Depends(get_db)
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
def get_me(current_user: DotDict = Depends(require_role(["MASTER_ADMIN", "LEAD_MANAGER", "COUNTRY_MANAGER"]))):
    """Retrieve profile information for the currently authenticated user session"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }
