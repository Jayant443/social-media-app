from fastapi import APIRouter, Depends, HTTPException, status
from src.communities.schema import CreateCommunitySchema, UpdateCommunitySchema, CommunitySchema, CommunityMemberSchema
from src.communities.service import CommunityService
from src.posts.schema import PostSchema
from src.dependencies.auth import get_current_user
from src.users.model import User
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from uuid import UUID
from typing import List

community_router = APIRouter()
community_service = CommunityService()

@community_router.post("/create", response_model=CommunitySchema, status_code=status.HTTP_201_CREATED)
async def create_community(community: CreateCommunitySchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.create_community(current_user.id, community, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community already exists")
    return db_community

@community_router.get("/{id}", response_model=CommunitySchema)
async def get_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.get_community(id, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@community_router.patch("/{id}", response_model=CommunitySchema)
async def update_community(id: UUID, community: UpdateCommunitySchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.update_community(id, community, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@community_router.delete("/{id}")
async def delete_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    result = await community_service.delete_community(id, session)
    return result

@community_router.post("/{id}/join", response_model=CommunityMemberSchema)
async def join_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_member = await community_service.join_community(current_user.id, id, session)
    if not db_community_member:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community not found")
    return db_community_member

@community_router.post("/{id}/leave")
async def leave_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    result = await community_service.leave_community(current_user.id, id, session)
    return result

@community_router.get("/{id}/members", response_model=List[CommunityMemberSchema])
async def get_community_members(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_members = await community_service.get_community_members(id, session)
    if not db_community_members:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Members not found")
    return db_community_members

@community_router.get("/{id}/posts", response_model=List[PostSchema])
async def get_community_posts(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_posts = await community_service.get_community_posts(id, session)
    if not db_community_posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Posts not found")
    return db_community_posts
