from fastapi import APIRouter, Depends, HTTPException
from src.votes.schema import VoteCreate, VoteUpdate, Vote
from src.votes.service import VoteService
from src.users.model import User
from src.core.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from src.dependencies.auth import get_current_user

vote_router = APIRouter()
vote_service = VoteService()

@vote_router.post("/post/{id}/vote")
async def vote_post(id: UUID, value: int, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session) ):
    return await vote_service.vote(current_user.id, id, "post", value, session)

@vote_router.post("/comment/{id}/vote")
async def vote_comment(id: UUID, value: int, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    return await vote_service.vote(current_user.id, id, "comment", value, session)

@vote_router.get("/{vote_id}/", response_model=Vote)
async def get_vote(vote_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await vote_service.get_vote(vote_id, session)

@vote_router.get("/user/{user_id}/", response_model=list[Vote])
async def get_user_votes(user_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await vote_service.get_user_votes(user_id, session)

@vote_router.get("/post/{post_id}/", response_model=list[Vote])
async def get_post_votes(post_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await vote_service.get_post_votes(post_id, session)

@vote_router.get("/comment/{comment_id}/", response_model=list[Vote])
async def get_comment_votes(comment_id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await vote_service.get_comment_votes(comment_id, session)
