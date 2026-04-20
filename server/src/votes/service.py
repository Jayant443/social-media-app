from sqlmodel.ext.asyncio.session import AsyncSession
from src.votes.model import Vote
from src.votes.schema import VoteCreate, VoteUpdate
from src.posts.model import Post
from src.comments.model import Comment
from typing import Optional
from uuid import UUID
from sqlmodel import select
from fastapi import HTTPException

class VoteService:
    async def get_vote(self, vote_id: UUID, session: AsyncSession) -> Optional[Vote]:
        return await session.get(Vote, vote_id)

    async def get_votes(self, session: AsyncSession) -> list[Vote]:
        result = await session.exec(select(Vote))
        return result.all()
    
    async def vote(self, user_id: UUID, target_id: UUID, target_type: str, value: int, session: AsyncSession):
        if value not in (1, -1):
            raise HTTPException(status_code=400, detail="Vote value must be 1 or -1")
        existing_vote = await session.exec(select(Vote).where( Vote.user_id == user_id, Vote.target_id == target_id, Vote.target_type == target_type))
        existing_vote = existing_vote.first()
        if target_type == "post":
            target = await session.get(Post, target_id)
        else:
            target = await session.get(Comment, target_id)
        if not target:
            raise HTTPException(status_code=404, detail=f"{target_type} not found")
        if existing_vote:
            if existing_vote.value == value:
                target.votes_score -= value
                await session.delete(existing_vote)
            else:
                target.votes_score += (value - existing_vote.value)
                existing_vote.value = value
                session.add(existing_vote)
        else:
            target.votes_score += value
            new_vote = Vote(user_id=user_id, target_id=target_id, target_type=target_type, value=value)
            session.add(new_vote)
        session.add(target)
        await session.commit()
        await session.refresh(target)
        return target

    async def get_user_vote(self, user_id: UUID, target_id: UUID, session: AsyncSession) -> Optional[Vote]:
        result = await session.exec(select(Vote).where(Vote.user_id == user_id, Vote.target_id == target_id))
        return result.first()

    async def get_post_votes(self, post_id: UUID, session: AsyncSession) -> list[Vote]:
        result = await session.exec(select(Vote).where(Vote.target_id == post_id, Vote.target_type == "post"))
        return result.all()

    async def get_comment_votes(self, comment_id: UUID, session: AsyncSession) -> list[Vote]:
        result = await session.exec(select(Vote).where(Vote.target_id == comment_id, Vote.target_type == "comment"))
        return result.all()
