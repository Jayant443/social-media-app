from sqlmodel import SQLModel, Field, Column
from uuid import UUID, uuid4
from sqlalchemy.dialects.mysql import BINARY
from datetime import datetime
from typing import Optional

class Community(SQLModel, table=True):
    __tablename__="communities"

    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    name: str = Field(primary_key=True)
    description: Optional[str] = None
    banner_url: str
    icon_url: str = Field(default=None)
    created_by: UUID = Field(sa_column=Column(BINARY(16), foreign_key="users.id"))
    is_private: bool = Field(default=False)
    is_restricted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CommunityMember(SQLModel, table=True):
    __tablename__ = "community_members"

    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    user_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="users.id"))
    community_id: UUID = Field(sa_column=Column(BINARY(16), foreign_key="communities.id"))
    role: str = Field(default="member", max_length=20)
    joined_at: datetime = Field(default_factory=datetime.utcnow)