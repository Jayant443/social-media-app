from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from src.users.model import User
from src.dependencies.auth import get_current_user
from src.users.schema import CreateUserSchema, UpdateUserSchema, UserSchema, SearchResponse
from src.posts.schema import PostSchema
from src.comments.schema import CommentSchema
from src.communities.schema import CommunitySchema
from src.users.service import UserService
from uuid import UUID
from typing import Optional, List
from src.utils.image_upload import upload_to_cloudinary

user_router = APIRouter()
user_service = UserService()

@user_router.get("/me", response_model=UserSchema)
async def get_me(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    user = await user_service.get_user_by_id(current_user.id, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@user_router.get("/me/saved", response_model=List[PostSchema])
async def get_user_saved_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_saved_posts(current_user.id, session)

@user_router.get("/me/communities", response_model=List[CommunitySchema])
async def get_user_communities(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_communities(current_user.id, session)

@user_router.get("/me/created-communities", response_model=List[CommunitySchema])
async def get_user_created_communities(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_created_communities(current_user.id, session)

@user_router.get("/me/posts", response_model=List[PostSchema])
async def get_user_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_posts(current_user.id, session)

@user_router.get("/me/comments", response_model=List[CommentSchema])
async def get_user_comments(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await user_service.get_user_comments(current_user.id, session)

@user_router.patch("/update", response_model=UserSchema)
async def update_user(username: str = Form(None), avatar: Optional[UploadFile] = File(None), bio: str = Form(None),current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    existing = user_service.get_user_by_id(current_user.id, session)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    update_data = {}
    if username:
        update_data["username"] = username
    if avatar:
        avatar_url = await upload_to_cloudinary(await avatar.read())
        update_data["avatar_url"] = avatar_url
    if bio:
        update_data["bio"] = bio
    user = UpdateUserSchema(**update_data)
    updated = await user_service.update_user(current_user.id, user, session)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated

@user_router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await user_service.delete_user(current_user.id, session)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

@user_router.get("/search", response_model=SearchResponse)
async def search(query: str, session: AsyncSession = Depends(get_session)):
    if not query.strip():
        return {"users": [], "posts": [], "communities": []}
    users = await user_service.get_user_search_results(query, session)
    posts = await user_service.get_post_search_results(query, session)
    communities = await user_service.get_community_search_results(query, session)
    return {"users": users, "posts": posts, "communities": communities}

@user_router.get("/{id}/get", response_model=UserSchema)
async def get_user_by_id(id: UUID, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user_by_id(id, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@user_router.get("/{user_id}/posts", response_model=List[PostSchema])
async def get_posts_by_user_id(user_id: UUID, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user_by_id(user_id, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return await user_service.get_user_posts(user_id, session)

@user_router.get("/{user_id}/comments", response_model=List[CommentSchema])
async def get_comments_by_user_id(user_id: UUID, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user_by_id(user_id, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return await user_service.get_user_comments(user_id, session)

@user_router.get("/{user_id}/r", response_model=List[CommunitySchema])
async def get_communities_by_user_id(user_id: UUID, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user_by_id(user_id, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return await user_service.get_user_communities(user_id, session)

@user_router.get("/{username}", response_model=UserSchema)
async def get_user_by_username(username: str, session: AsyncSession = Depends(get_session)):
    user = await user_service.get_user(username, session)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user