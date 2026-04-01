from fastapi import APIRouter, Depends, HTTPException
from src.votes.schema import VoteCreate, VoteUpdate, Vote
from src.votes.service import VoteService
from src.core.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID

vote_router = APIRouter()
vote_service = VoteService()

@vote_router.post("/", response_model=Vote)
async def up_vote(vote: VoteCreate, session: AsyncSession = Depends(get_session)):
    return await vote_service.up_vote(vote, session)

@vote_router.post("/{vote_id}/", response_model=Vote)
async def down_vote(vote_id: UUID, vote: VoteUpdate, session: AsyncSession = Depends(get_session)):
    return await vote_service.down_vote(vote_id, vote, session)

@vote_router.delete("/{vote_id}/", response_model=Vote)
async def delete_vote(vote_id: UUID, session: AsyncSession = Depends(get_session)):
    return await vote_service.delete_vote(vote_id, session)

@vote_router.get("/{vote_id}/", response_model=Vote)
async def get_vote(vote_id: UUID, session: AsyncSession = Depends(get_session)):
    return await vote_service.get_vote(vote_id, session)

@vote_router.get("/user/{user_id}/", response_model=list[Vote])
async def get_user_votes(user_id: UUID, session: AsyncSession = Depends(get_session)):
    return await vote_service.get_user_votes(user_id, session)

@vote_router.get("/post/{post_id}/", response_model=list[Vote])
async def get_post_votes(post_id: UUID, session: AsyncSession = Depends(get_session)):
    return await vote_service.get_post_votes(post_id, session)

@vote_router.get("/comment/{comment_id}/", response_model=list[Vote])
async def get_comment_votes(comment_id: UUID, session: AsyncSession = Depends(get_session)):
    return await vote_service.get_comment_votes(comment_id, session)
