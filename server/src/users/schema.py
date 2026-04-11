from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class CreateUserSchema(UserBase):
    password: str

class LoginUserSchema(BaseModel):
    identifier: str
    password: str

class UpdateUserSchema(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class UserSchema(UserBase):
    id: UUID
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    model_config=ConfigDict(from_attributes=True)
