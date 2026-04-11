from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class CommunityBase(BaseModel):
    name: str
    description: Optional[str] = Field(default=None)
    banner_url: Optional[str] = Field(default=None)
    icon_url: Optional[str] = Field(default=None)

class CreateCommunitySchema(CommunityBase):
    pass

class UpdateCommunitySchema(BaseModel):
    description: Optional[str] = Field(default=None)
    banner_url: Optional[str] = Field(default=None)
    icon_url: Optional[str] = Field(default=None)

class CommunitySchema(CommunityBase):
    id: UUID
    created_by: UUID
    is_private: bool = Field(False)
    is_restricted: bool = Field(False)
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommunityMemberSchema(BaseModel):
    id: UUID
    user_id: UUID
    community_id: UUID
    role: Optional[str] = "member"
    joined_at: datetime
    model_config = ConfigDict(from_attributes=True)
