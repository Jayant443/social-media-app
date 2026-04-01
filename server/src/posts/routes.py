from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from src.users.model import User
from src.dependencies.auth import get_current_user
from src.posts.schema import CreatePostSchema, UpdatePostSchema, PostSchema, SavedPostSchema, SavePostSchema
from src.posts.service import PostService
from uuid import UUID

post_router = APIRouter()
post_service = PostService()

@post_router.post("/create", response_model=PostSchema)
async def create_post(post: CreatePostSchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.create_post(post, session)

@post_router.get("/{id}", response_model=PostSchema)
async def get_post(id: UUID, session: AsyncSession = Depends(get_session)):
    return await post_service.get_post(id, session)

@post_router.patch("/{id}", response_model=PostSchema)
async def update_post(id: UUID, post: UpdatePostSchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.update_post(id, post, session)

@post_router.delete("/{id}", response_model=PostSchema)
async def delete_post(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.delete_post(id, session)

@post_router.post("/save", response_model=SavedPostSchema)
async def save_post(post: SavePostSchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.save_post(post, session)

@post_router.delete("/unsave/{id}", response_model=SavedPostSchema)
async def unsave_post(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.unsave_post(id, session)