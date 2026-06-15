from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    mobile: str = Field(..., min_length=10, max_length=10)
    message: str = Field(..., min_length=1)
    preferred_country: Optional[str] = ""

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    mobile: str
    message: str
    preferred_country: str
    email_sent: bool

    class Config:
        from_attributes = True
