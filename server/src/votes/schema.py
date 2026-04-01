from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class VoteBase(BaseModel):
    user_id: UUID
    target_id: UUID
    target_type: str

class VoteCreate(VoteBase):
    value: int

class VoteUpdate(BaseModel):
    value: int

class Vote(VoteBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)