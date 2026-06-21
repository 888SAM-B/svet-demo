from pydantic import BaseModel
from typing import Optional

class AuthLogin(BaseModel):
    email: str
    password: str

class UserInfo(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserInfo
