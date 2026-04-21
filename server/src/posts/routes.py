from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from src.users.model import User
from src.dependencies.auth import get_current_user
from src.posts.schema import CreatePostSchema, RecentPostsSchema, UpdatePostSchema, PostSchema, SavedPostSchema, SavePostSchema
from src.posts.service import PostService
from src.utils.image_upload import upload_to_cloudinary
from uuid import UUID
from typing import List, Optional

post_router = APIRouter()
post_service = PostService()

@post_router.get("/recent", response_model=List[RecentPostsSchema])
async def get_recent_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.get_recent_posts(session)

@post_router.post("/{community_id}/create", response_model=PostSchema)
async def create_post(community_id: UUID, title: str = Form(...), body: Optional[str] = Form(None), url: Optional[str] = Form(None), image: Optional[UploadFile] = File(None), session: AsyncSession = Depends(get_session),  current_user: User = Depends(get_current_user)):
    image_url = None
    if image:
        image_bytes = await image.read()
        image_url = await upload_to_cloudinary(image_bytes)
    
    post_data = CreatePostSchema(
        title=title,
        body=body,
        url=url,
        image_url=image_url
    )
    return await post_service.create_post(current_user.id, community_id, post_data, session)

@post_router.get("/saved-ids", response_model=List[UUID])
async def get_saved_post_ids(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.get_saved_post_ids(current_user.id, session)

@post_router.get("/saved_posts", response_model=List[RecentPostsSchema])
async def get_saved_posts(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await post_service.get_saved_posts(current_user.id, session)

@post_router.get("/{id}", response_model=RecentPostsSchema)
async def get_post(id: UUID, session: AsyncSession = Depends(get_session)):
    result = await post_service.get_post(id, session)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return result

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

@post_router.delete("/unsave/{post_id}")
async def unsave_post(post_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    success = await post_service.unsave_post(current_user.id, post_id, session)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved post not found")
    return {"message": "Post unsaved"}

