from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class PostBase(BaseModel):
    title: str
    body: Optional[str] = None
    url: Optional[str] = None

class CreatePostSchema(PostBase):
    pass

class UpdatePostSchema(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    url: Optional[str] = None

class PostSchema(PostBase):
    id: UUID
    author_id: UUID
    community_id: UUID
    votes_score: int
    comment_count: int
    is_deleted: bool
    is_locked: bool
    is_pinned: bool
    created_at: datetime
    updated_at: datetime
    model_config=ConfigDict(from_attributes=True)

class SavePostSchema(BaseModel):
    post_id: UUID

class SavedPostSchema(BaseModel):
    id: UUID
    user_id: UUID
    post_id: UUID
    saved_at: datetime
    model_config=ConfigDict(from_attributes=True)