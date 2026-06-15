from pydantic import BaseModel
from typing import Optional

class AuthLogin(BaseModel):
    username: str
    password: str

class AdminInfo(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    admin: AdminInfo
