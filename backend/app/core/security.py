from datetime import datetime, timedelta, timezone
from typing import Union, Any, List, Optional
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings
from .database import get_db

security_scheme = HTTPBearer()

class DotDict(dict):
    """Dictionary supporting dot notation attribute access (e.g. user.id, user.email)"""
    def __getattr__(self, item):
        try:
            return self[item]
        except KeyError:
            return None
            
    def __setattr__(self, key, value):
        self[key] = value

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare plain password with hashed DB version"""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Bcrypt password hashing helper"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(user_id: int, role: str, expires_delta: Optional[timedelta] = None) -> str:
    """Generate user access JWT token with ID and role claims"""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire, 
        "sub": str(user_id),
        "user_id": user_id,
        "role": role,
        "iat": datetime.now(timezone.utc)
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Union[dict, None]:
    """Validate and decode client token payload"""
    try:
        decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return decoded_payload
    except jwt.PyJWTError:
        return None

def require_role(allowed_roles: List[str]):
    """
    Dependency generator for route-level role-based authorization checks with MongoDB.
    """
    def dependency(
        credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
        db = Depends(get_db)
    ) -> DotDict:
        token = credentials.credentials
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired or invalid token. Please log in again."
            )
        
        user_id = payload.get("user_id")
        role = payload.get("role")
        if not user_id or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload is missing user identifiers."
            )
            
        user_data = db.users.find_one({"id": user_id})
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorized profile not found."
            )
            
        user = DotDict(user_data)
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated."
            )
            
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied. You do not have the required role to access this resource."
            )
            
        return user
        
    return dependency
