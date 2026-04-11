from sqlmodel import SQLModel, Field, Column
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey
from src.core.types import BinaryUUID
from datetime import datetime, timezone
from typing import Optional
import enum

class Role(str, enum.Enum):
    member = "member"
    moderator = "moderator"
    admin = "admin"

class Community(SQLModel, table=True):
    __tablename__="communities"

    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    name: str = Field(index=True, unique=True)
    description: Optional[str] = None
    banner_url: Optional[str] = None
    icon_url: Optional[str] = None
    created_by: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("users.id")))
    is_private: bool = Field(default=False)
    is_restricted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunityMember(SQLModel, table=True):
    __tablename__ = "community_members"

    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    user_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("users.id")))
    community_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("communities.id")))
    role: Role
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
