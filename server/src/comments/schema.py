from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class CommentBase(BaseModel):
    author_id: UUID
    post_id: Optional[UUID] = None
    body: str
    parent_id: Optional[UUID] = None

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    body: Optional[str] = None
    is_deleted: Optional[bool] = False

class CommentSchema(CommentBase):
    id: UUID
    vote_score: int = 0
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
