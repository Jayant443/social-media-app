from sqlmodel.ext.asyncio.session import AsyncSession
from src.votes.model import Vote
from src.votes.schema import VoteCreate, VoteUpdate
from typing import Optional
from uuid import UUID
from sqlmodel import select

class VoteService:
    async def get_vote(self, vote_id: UUID, session: AsyncSession) -> Optional[Vote]:
        result = await session.get(Vote, vote_id)
        return result.first()

    async def get_votes(self, session: AsyncSession) -> list[Vote]:
        result = await session.exec(select(Vote))
        return result.all()

    async def up_vote(self, vote: VoteCreate, session: AsyncSession) -> Vote:
        result = await session.exec(select(Vote).where(Vote.user_id == vote.user_id, Vote.target_id == vote.target_id, Vote.target_type == vote.target_type))
        existing_vote = result.first()
        if existing_vote:
            return None
        db_vote = Vote(**vote.dict())
        session.add(db_vote)
        await session.commit()
        await session.refresh(db_vote)
        return db_vote

    async def down_vote(self, vote_id: UUID, vote: VoteUpdate, session: AsyncSession) -> Optional[Vote]:
        db_vote = await self.get_vote(vote_id, session)
        if not db_vote:
            return None
        db_vote.value = -1
        session.add(db_vote)
        await session.commit()
        await session.refresh(db_vote)
        return db_vote

    async def delete_vote(self, vote_id: UUID, session: AsyncSession) -> bool:
        db_vote = await self.get_vote(vote_id, session)
        if not db_vote:
            return False
        await session.delete(db_vote)
        await session.commit()
        return True

    async def get_user_vote(self, user_id: UUID, target_id: UUID, session: AsyncSession) -> Optional[Vote]:
        result = await session.exec(select(Vote).where(Vote.user_id == user_id, Vote.target_id == target_id))
        return result.first()

    async def get_post_votes(self, post_id: UUID, session: AsyncSession) -> list[Vote]:
        result = await session.exec(select(Vote).where(Vote.target_id == post_id, Vote.target_type == "post"))
        return result.all()

    async def get_comment_votes(self, comment_id: UUID, session: AsyncSession) -> list[Vote]:
        result = await session.exec(select(Vote).where(Vote.target_id == comment_id, Vote.target_type == "comment"))
        return result.all()
