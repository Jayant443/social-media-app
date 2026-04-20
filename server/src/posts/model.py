from sqlmodel import SQLModel, Field, Column
from sqlalchemy import ForeignKey
from src.core.types import BinaryUUID
from datetime import datetime, timezone
from uuid import UUID, uuid4
from typing import Optional

class Post(SQLModel, table=True):
    __tablename__="posts"
    
    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    author_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("users.id")))
    community_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("communities.id")))
    title: str = Field(max_length=200)
    body: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    votes_score: int = Field(default=0)
    comment_count: int = Field(default=0)
    is_deleted: bool = Field(default=False)
    is_locked: bool = Field(default=False)
    is_pinned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SavedPost(SQLModel, table=True):
    __tablename__ = "saved_posts"

    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    user_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("users.id")))
    post_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("posts.id")))
    saved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
