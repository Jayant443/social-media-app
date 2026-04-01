from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.comments.service import CommentService
from src.dependencies.auth import get_current_user
from src.core.database import get_session
from src.users.model import User
from src.comments.schema import CommentCreate, CommentUpdate, CommentSchema
from uuid import UUID

comment_router = APIRouter()
comment_service = CommentService()

@comment_router.post("/", response_model=CommentSchema)
async def create_comment(comment: CommentCreate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.create_comment(comment, session)

@comment_router.get("/{comment_id}", response_model=CommentSchema)
async def get_comment(comment_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.get_comment(comment_id, session)

@comment_router.get("/post/{post_id}", response_model=list[CommentSchema])
async def get_comments_by_post(post_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.get_comments_by_post(post_id, session)

@comment_router.put("/{comment_id}", response_model=CommentSchema)
async def update_comment(comment_id: UUID, comment: CommentUpdate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.update_comment(comment_id, comment, session)

@comment_router.delete("/{comment_id}", response_model=bool)
async def delete_comment(comment_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.delete_comment(comment_id, session)

@comment_router.get("/user/{user_id}", response_model=list[CommentSchema])
async def get_comments_by_user(user_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.get_comments_by_user(user_id, session)