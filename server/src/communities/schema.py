from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class CommunityBase(BaseModel):
    name: str
    description: Optional[str] = None
    banner_url: str
    icon_url: Optional[str] = None

class CreateCommunitySchema(CommunityBase):
    pass

class UpdateCommunitySchema(BaseModel):
    description: Optional[str] = None
    icon_url: Optional[str] = None

class CommunitySchema(CommunityBase):
    id: UUID
    created_by: UUID
    is_private: bool
    is_restricted: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommunityMemberSchema(BaseModel):
    id: UUID
    user_id: UUID
    community_id: UUID
    role: Optional[str] = "member"
    joined_at: datetime
    model_config = ConfigDict(from_attributes=True)
