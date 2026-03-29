from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.mysql import BINARY
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4

class Comment(SQLModel, table=True):
    __tablename__ = "comments"

    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    author_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="users.id"))
    post_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="posts.id"))
    parent_id: Optional[UUID] = Field(sa_column=Column(BINARY(16), foreign_key="comments.id"))
    body: str
    vote_score: int = Field(default=0)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
