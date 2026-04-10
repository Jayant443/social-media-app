from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import Optional, List
from sqlmodel import select, or_
from src.communities.model import Community, CommunityMember
from src.communities.schema import CreateCommunitySchema, UpdateCommunitySchema, CommunitySchema, CommunityMemberSchema
from src.posts.model import Post

class CommunityService:
    async def create_community(self, creator_id: UUID, community: CreateCommunitySchema, session: AsyncSession) -> Optional[Community]:
        result = await session.exec(select(Community).where(Community.name == community.name))
        if result.first():
            return None
        community_data_dict = community.dict(exclude_unset=True)
        community_data_dict["created_by"] = creator_id
        community_data = Community(**community_data_dict)
        session.add(community_data)
        await session.commit()
        await session.refresh(community_data)
        return community_data

    async def get_community(self, id: UUID, session: AsyncSession) -> Optional[Community]:
        result = await session.exec(select(Community).where(Community.id == id))
        return result.first()

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
        community_member = CommunityMember(user_id=user_id, community_id=community_id)
        session.add(community_member)
        await session.commit()
        await session.refresh(community_member)
        return community_member

    async def leave_community(self, user_id: UUID, community_id: UUID, session: AsyncSession) -> Optional[CommunityMember]:
        result = await session.exec(select(CommunityMember).where(or_(CommunityMember.user_id == user_id, CommunityMember.community_id == community_id)))
        db_community_member = result.first()
        if not db_community_member:
            return None
        await session.delete(db_community_member)
        await session.commit()
        return True

    async def get_community_members(self, id: UUID, session: AsyncSession) -> Optional[List[CommunityMember]]:
        result = await session.exec(select(CommunityMember).where(CommunityMember.community_id == id))
        return result.all()

    async def get_community_posts(self, id: UUID, session: AsyncSession) -> Optional[List[Post]]:
        result = await session.exec(select(Post).where(Post.community_id == id))
        return result.all()
