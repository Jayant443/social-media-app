from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import Optional, List
from sqlmodel import select, or_
from sqlalchemy.sql import func
from src.communities.model import Community, CommunityMember
from src.communities.schema import CreateCommunitySchema, UpdateCommunitySchema, CommunitySchema, CommunityMemberSchema
from src.posts.model import Post

class CommunityService:
    async def create_community(self, creator_id: UUID, community: CreateCommunitySchema, session: AsyncSession) -> Optional[Community]:
        community_data_dict = community.dict(exclude_unset=True)
        community_data_dict["created_by"] = creator_id
        new_community = Community(**community_data_dict)
        session.add(new_community)
        await session.commit()
        await session.refresh(new_community)
        community_member = CommunityMember(user_id=creator_id, community_id=new_community.id, role="admin")
        session.add(community_member)
        await session.commit()
        await session.refresh(community_member)
        return new_community

    async def get_community(self, id: UUID, session: AsyncSession) -> Optional[Community]:
        result = await session.exec(select(Community).where(Community.id == id))
        return result.first()
    
    async def get_community_by_name(self, name: str, session: AsyncSession) -> Optional[Community]:
        result = await session.exec(select(Community).where(Community.name==name))
        return result.first()
    
    async def get_random_communities(self, session: AsyncSession, limit: int = 10) -> List[CommunitySchema]:
        result = await session.exec(select(Community).order_by(func.random()).limit(limit))
        return result.all()

    async def update_community(self, id: UUID, community: UpdateCommunitySchema, session: AsyncSession) -> Optional[Community]:
        db_community = await session.get(Community, id)
        if not db_community:
            return None
        community_data = community.dict(exclude_unset=True)
        for key, value in community_data.items():
            setattr(db_community, key, value)
        session.add(db_community)
        await session.commit()
        await session.refresh(db_community)
        return db_community

    async def delete_community(self, id: UUID, session: AsyncSession) -> Optional[Community]:
        db_community = await session.get(Community, id)
        if not db_community:
            return False
        await session.delete(db_community)
        await session.commit()
        return True

    async def join_community(self, user_id: UUID, community_id: UUID, session: AsyncSession) -> Optional[CommunityMember]:
        community_member = CommunityMember(user_id=user_id, community_id=community_id, role="member")
        session.add(community_member)
        await session.commit()
        await session.refresh(community_member)
        return community_member

    async def leave_community(self, user_id: UUID, community_id: UUID, session: AsyncSession) -> bool:
        result = await session.exec(select(CommunityMember).where(or_(CommunityMember.user_id == user_id, CommunityMember.community_id == community_id)))
        db_community_member = result.first()
        if not db_community_member:
            return False
        await session.delete(db_community_member)
        await session.commit()
        return True

    async def get_community_members(self, id: UUID, session: AsyncSession) -> List[CommunityMember]:
        result = await session.exec(select(CommunityMember).where(CommunityMember.community_id == id))
        return list(result.all())

    async def get_community_posts(self, id: UUID, session: AsyncSession) -> List[Post]:
        result = await session.exec(select(Post).where(Post.community_id == id))
        return list(result.all())
