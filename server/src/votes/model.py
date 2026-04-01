from sqlmodel import SQLModel, Field, Column
from sqlalchemy import ForeignKey
from src.core.types import BinaryUUID
from typing import Optional
from datetime import datetime, timezone
from uuid import UUID, uuid4
import enum

class TargetType(str, enum.Enum):
    post = "post"
    comment = "comment"

class Vote(SQLModel, table=True):
    __tablename__="votes"

    id: UUID = Field(sa_column=Column(BinaryUUID, primary_key=True, default=uuid4))
    user_id: UUID = Field(sa_column=Column(BinaryUUID, ForeignKey("users.id")))
    target_id: UUID = Field(sa_column=Column(BinaryUUID, nullable=False))
    target_type: TargetType
    value: int = Field(ge=-1, le=1)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
