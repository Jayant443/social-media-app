from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from src.users.model import User
from src.dependencies.auth import get_current_user
from src.posts.schema import CreatePostSchema, RecentPostsSchema, UpdatePostSchema, PostSchema, SavedPostSchema, SavePostSchema
from src.posts.service import PostService
from uuid import UUID
from typing import List

post_router = APIRouter()
post_service = PostService()

@post_router.get("/recent", response_model=List[RecentPostsSchema])
async def get_recent_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.get_recent_posts(session)

@post_router.post("/{community_id}/create", response_model=PostSchema)
async def create_post(community_id: UUID, post: CreatePostSchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.create_post(current_user.id, community_id, post, session)

@post_router.get("/{id}", response_model=PostSchema)
async def get_post(id: UUID, session: AsyncSession = Depends(get_session)):
    return await post_service.get_post(id, session)

@post_router.patch("/{id}", response_model=PostSchema)
async def edit_post(id: UUID, post: UpdatePostSchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    result = await post_service.edit_post(id, post, session)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

@post_router.delete("/{id}", response_model=PostSchema)
async def delete_post(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.delete_post(id, session)

@post_router.post("/save", response_model=SavedPostSchema)
async def save_post(post: SavePostSchema, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    result = await post_service.save_post(current_user.id, post, session)
    if not result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Post already saved")
    return result

@post_router.delete("/unsave/{id}")
async def unsave_post(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.unsave_post(id, session)

@post_router.get("/saved_posts")
async def get_saved_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.get_saved_posts(current_user.id, session)
