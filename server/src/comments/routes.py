from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.comments.service import CommentService
from src.dependencies.auth import get_current_user
from src.core.database import get_session
from src.users.model import User
from src.comments.schema import CommentCreate, CommentUpdate, CommentSchema, ExpandedCommentSchema
from uuid import UUID

comment_router = APIRouter()
comment_service = CommentService()

@comment_router.post("/{post_id}/comment", response_model=ExpandedCommentSchema)
async def create_comment(post_id: UUID, body: str, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    comment = await comment_service.create_comment(current_user.id, body, session, post_id)
    return {**comment.dict(), "author_username": current_user.username, "author_avatar_url": current_user.avatar_url}

@comment_router.post("/{post_id}/comment/{comment_id}/reply", response_model=ExpandedCommentSchema)
async def reply(post_id: UUID, comment_id: UUID, reply: str, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    comment = await comment_service.create_comment(current_user.id, reply, session, post_id, comment_id)
    return {**comment.dict(), "author_username": current_user.username, "author_avatar_url": current_user.avatar_url}

@comment_router.get("/comment/{comment_id}", response_model=CommentSchema)
async def get_comment(comment_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.get_comment(comment_id, session)

@comment_router.get("/post/{post_id}", response_model=list[ExpandedCommentSchema])
async def get_top_comments(post_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.get_top_comments(post_id, session)

@comment_router.get("/{comment_id}/replies", response_model=list[ExpandedCommentSchema])
async def get_replies(comment_id: UUID, session: AsyncSession = Depends(get_session)):
    return await comment_service.get_replies(comment_id, session)

@comment_router.get("/{comment_id}/replies/count")
async def get_reply_count(comment_id: UUID, session: AsyncSession = Depends(get_session)):
    return await comment_service.get_reply_count(comment_id, session)

@comment_router.put("/{comment_id}", response_model=CommentSchema)
async def update_comment(comment_id: UUID, comment: CommentUpdate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.update_comment(comment_id, comment, session)

@comment_router.delete("/{comment_id}", response_model=bool)
async def delete_comment(comment_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    success = await comment_service.delete_comment(comment_id, current_user.id, session)
    if not success:
        raise HTTPException(status_code=403, detail="Could not delete comment")
    return success

@comment_router.get("/user/{user_id}", response_model=list[CommentSchema])
async def get_comments_by_user(user_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await comment_service.get_comments_by_user(user_id, session)