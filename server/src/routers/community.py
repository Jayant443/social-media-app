from fastapi import APIRouter, Depends, HTTPException, status
from src.models.community import Community, CommunityMember
from src.schemas.community import CreateCommunitySchema, UpdateCommunitySchema, CommunitySchema, CommunityMemberSchema
from src.services.community import CommunityService
from src.schemas.post import PostSchema
from src.services.auth import get_current_user
from src.models.user import User
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from uuid import UUID
from typing import Optional, List

router = APIRouter()
community_service = CommunityService()

@router.post("/", response_model=CommunitySchema, status_code=status.HTTP_201_CREATED)
async def create_community(community: CreateCommunitySchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.create_community(community, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community already exists")
    return db_community

@router.get("/{id}", response_model=CommunitySchema)
async def get_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.get_community(id, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@router.patch("/{id}", response_model=CommunitySchema)
async def update_community(id: UUID, community: UpdateCommunitySchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.update_community(id, community, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@router.delete("/{id}", response_model=CommunitySchema)
async def delete_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.delete_community(id, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@router.post("/{id}/join", response_model=CommunityMemberSchema)
async def join_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_member = await community_service.join_community(current_user.id, id, session)
    if not db_community_member:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community not found")
    return db_community_member

@router.post("/{id}/leave", response_model=CommunityMemberSchema)
async def leave_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_member = await community_service.leave_community(current_user.id, id, session)
    if not db_community_member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community_member

@router.get("/{id}/members", response_model=List[CommunityMemberSchema])
async def get_community_members(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_members = await community_service.get_community_members(id, session)
    if not db_community_members:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community_members

@router.get("/{id}/posts", response_model=List[PostSchema])
async def get_community_posts(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_posts = await community_service.get_community_posts(id, session)
    if not db_community_posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community_posts
