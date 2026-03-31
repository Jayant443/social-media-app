from sqlmodel import SQLModel, Field, Column
from uuid import UUID, uuid4
from sqlalchemy.dialects.mysql import BINARY
from datetime import datetime, timezone, timedelta
from typing import Optional

class User(SQLModel, table=True):
    __tablename__="users"

    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    username: str = Field(max_length=30, unique=True)
    email: str = Field(unique=True)
    password: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool = Field(default=None)
    is_admin: bool = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    