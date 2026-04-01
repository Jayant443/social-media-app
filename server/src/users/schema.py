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
    @field_validator("password", mode="before")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password cannot be longer than 72 bytes")
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class UpdateUserSchema(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    password: Optional[str] = None

class UserSchema(UserBase):
    id: UUID
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    model_config=ConfigDict(from_attributes=True)
