from sqlmodel import SQLModel, Field, Column
from sqlalchemy import ForeignKey
from src.core.types import BinaryUUID
from typing import Optional
from datetime import datetime, timezone
from uuid import UUID, uuid4

class Comment(SQLModel, table=True):
    __tablename__ = "comments"

    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    author_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("users.id")))
    post_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("posts.id")))
    parent_id: Optional[UUID] = Field(sa_column=Column(BinaryUUID, ForeignKey("comments.id"), nullable=True))
    body: str
    vote_score: int = Field(default=0)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
