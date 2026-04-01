from sqlmodel import SQLModel, Field, Column
from uuid import UUID, uuid4
from src.core.types import BinaryUUID
from datetime import datetime, timezone
from typing import Optional

class User(SQLModel, table=True):
    __tablename__="users"

    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    username: str = Field(max_length=30, unique=True)
    email: str = Field(unique=True)
    password: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool = Field(default=False)
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
