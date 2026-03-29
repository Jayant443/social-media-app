from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.mysql import BINARY
from datetime import datetime, timezone, timedelta
from uuid import UUID, uuid4
from typing import Optional

class Post(SQLModel, table=True):
    __tablename__="posts"
    
    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    author_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="users.id"))
    community_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="communities.id"))
    title: str = Field(max_length=200)
    body: Optional[str] = None
    url: Optional[str] = None
    votes_score: int = Field(default=0)
    comment_count: int = Field(default=0)
    is_deleted: bool = Field(default=False)
    is_locked: bool = Field(default=False)
    is_pinned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=datetime.now(timezone.utc))

class SavedPost(SQLModel, table=True):
    __tablename__ = "saved_posts"

    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    user_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="users.id"))
    post_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="posts.id"))
    saved_at: datetime = Field(default_factory=datetime.now(timezone.utc))