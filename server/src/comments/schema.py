from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class CommentBase(BaseModel):
    body: str
    vote_score: int = 0
    is_deleted: bool = False

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    body: Optional[str] = None
    is_deleted: Optional[bool] = False

class CommentSchema(CommentBase):
    id: UUID
    author_id: UUID
    post_id: UUID
    parent_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
