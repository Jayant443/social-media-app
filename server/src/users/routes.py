from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from src.users.model import User
from src.dependencies.auth import get_current_user
from src.users.schema import CreateUserSchema, UpdateUserSchema, UserSchema
from src.users.service import UserService
from uuid import UUID
from typing import Optional, List

user_router = APIRouter()
user_service = UserService()

@user_router.get("/me", response_model=UserSchema)
async def get_user(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_by_id(session)

@user_router.get("/{id}", response_model=UserSchema)
async def get_user(id: UUID, session: AsyncSession = Depends(get_session)):
    return await user_service.get_user_by_id(id, session)

@user_router.get("/{username}", response_model=UserSchema)
async def get_user(username: str, session: AsyncSession = Depends(get_session)):
    return await user_service.get_user(username, session)

@user_router.patch("/{id}", response_model=UserSchema)
async def update_user(id: UUID, user: UpdateUserSchema, session: AsyncSession = Depends(get_session)):
    return await user_service.update_user(id, user, session)

@user_router.delete("/{id}", response_model=UserSchema)
async def delete_user(id: UUID, session: AsyncSession = Depends(get_session)):
    return await user_service.delete_user(id, session)

@user_router.get("/me/posts", response_model=List[PostSchema])
async def get_user_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_posts(current_user.id, session)

@user_router.get("/me/comments", response_model=List[CommentSchema])
async def get_user_comments(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_comments(current_user.id, session)

@user_router.get("/me/saved", response_model=List[PostSchema])
async def get_user_saved_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_saved_posts(current_user.id, session)

@user_router.get("/me/communities", response_model=List[CommunitySchema])
async def get_user_communities(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_communities(current_user.id, session)

@user_router.get("/me/created-communities", response_model=List[CommunitySchema])
async def get_user_created_communities(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_created_communities(current_user.id, session)