from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from src.posts.schema import PostSchema
from src.communities.schema import CommunitySchema

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

class SearchResponse(BaseModel):
    users: List[UserSchema]
    posts: List[PostSchema]
    communities: List[CommunitySchema]