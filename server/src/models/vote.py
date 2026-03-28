from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.mysql import BINARY
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
import enum

class TargetType(str, enum.Enum):
    post = "post"
    comment = "comment"

class Vote(SQLModel, table=True):
    __tablename__="votes"

    id: UUID = Field(sa_column=Column(BINARY(16), primary_key=True, default=uuid4))
    user_id: UUID = Field(foreign_key="users.id")
    target_id: UUID
    target_type: TargetType
    value: int = Field(ge=-1, le=1)
    created_at: datetime = Field(default=datetime.utcnow)
