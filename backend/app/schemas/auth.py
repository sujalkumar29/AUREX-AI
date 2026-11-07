from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    organization_id: Optional[str] = None

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "creator"  # admin, creator, reviewer
    organization_name: Optional[str] = "Enterprise Brand"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    organization_id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True
